import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import * as cheerio from 'cheerio'

import {
	ScrappedJob,
	ScrapperPayload,
	ScrapperStrategy
} from '@/common/abstracts/scrapper-strategy.abstract'

export const DOUUA_STRATEGY_TOKEN = Symbol('DOUUA_STRATEGY_TOKEN')

type CardPreview = Omit<ScrappedJob, 'description'>

type DetailEnrichment = Pick<ScrappedJob, 'description'>

@Injectable()
export class DouUaScrapperStrategy extends ScrapperStrategy {
	private readonly logger = new Logger(DouUaScrapperStrategy.name)

	private readonly http: AxiosInstance = axios.create({
		baseURL: 'https://jobs.dou.ua',
		timeout: 15_000,
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
				'(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
			'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
			'Accept-Encoding': 'gzip, deflate, br',
			Connection: 'keep-alive',
			'Upgrade-Insecure-Requests': '1'
		}
	})

	private readonly DELAY_MS = 700

	// ─── Public API ─────────────────────────────────────────────────────────────

	public async scrape(payload: ScrapperPayload): Promise<ScrappedJob[]> {
		const { position, tags, limit } = payload

		this.logger.log(
			`DOU scrape started — position="${position}", tags=[${tags.join(', ')}], limit=${limit}`
		)

		// One search per keyword, deduplicate by sourceUrl
		const keywords = [position, ...tags]
		const seen = new Map<string, CardPreview>()

		for (const keyword of keywords) {
			this.logger.debug(`Searching keyword: "${keyword}"`)

			const cards = await this.fetchCardsByKeyword(keyword)

			for (const card of cards) {
				if (!seen.has(card.sourceUrl)) {
					seen.set(card.sourceUrl, card)
				}
			}

			this.logger.debug(
				`"${keyword}" -> ${cards.length} results | unique pool: ${seen.size}`
			)

			if (seen.size >= limit * 2) break

			await this.delay(this.DELAY_MS)
		}

		// Enrich each candidate with the full description from the detail page
		const candidates = [...seen.values()].slice(0, limit)
		const jobs: ScrappedJob[] = []

		for (const card of candidates) {
			try {
				const detail = await this.fetchDetail(card.sourceUrl)
				await this.delay(this.DELAY_MS)

				jobs.push({
					...card,
					position,
					description: detail.description
				})
			} catch (err) {
				this.logger.warn(
					`Skipping ${card.sourceUrl} — ${(err as Error).message}`
				)
			}
		}

		this.logger.log(`DOU scrape done — ${jobs.length} jobs collected`)
		return jobs
	}

	// ─── List page ───────────────────────────────────────────────────────────────

	/**
	 * DOU search URL:
	 *   /vacancies/?search=<keyword>
	 *
	 * Each keyword gets its own focused request — combining all tags into one
	 * query degrades result relevance significantly.
	 */
	private async fetchCardsByKeyword(keyword: string): Promise<CardPreview[]> {
		const path = `/vacancies/?search=${encodeURIComponent(keyword)}`
		this.logger.debug(`GET ${path}`)

		const html = await this.get(path)
		const $ = cheerio.load(html)

		if (process.env.SCRAPPER_DEBUG === 'true') {
			this.debugSelectors($)
		}

		return this.parseCards($)
	}

	/**
	 * Actual DOU card markup (confirmed from live HTML):
	 *
	 *   <li class="l-vacancy __hot?">
	 *     <div class="date">18 травня</div>
	 *     <div class="title">
	 *       <a class="vt" href="https://jobs.dou.ua/...">Job Title</a>
	 *       <strong>в <a class="company" href="..."><img>Company</a></strong>
	 *       <span class="salary">$4000–6000</span>          <!-- optional -->
	 *       <span class="cities bi bi-geo-alt-fill"> Київ</span>
	 *     </div>
	 *     <div class="sh-info">Short description snippet...</div>
	 *   </li>
	 */
	private parseCards($: cheerio.CheerioAPI): CardPreview[] {
		const results: CardPreview[] = []

		$('li.l-vacancy').each((_i, el) => {
			const $card = $(el)

			// ── Title & URL ──────────────────────────────────────────────────────
			const $titleLink = $card.find('a.vt').first()
			const title = $titleLink.text().trim()
			const sourceUrl = $titleLink.attr('href') ?? ''

			if (!title || !sourceUrl) return

			// ── Company ──────────────────────────────────────────────────────────
			// <a class="company" href="..."><img> Company Name</a>
			// img alt is empty so .text() gives just the company name
			const company =
				$card.find('a.company').first().text().trim() || undefined

			// ── Salary ───────────────────────────────────────────────────────────
			// <span class="salary">$4000–6000</span>  — absent when not specified
			const salaryRaw =
				$card.find('span.salary').first().text().trim() || undefined
			const { salary, salaryValueFrom, salaryValueTo } =
				this.parseSalary(salaryRaw)

			// ── Location ─────────────────────────────────────────────────────────
			// <span class="cities bi bi-geo-alt-fill"> Київ</span>
			// Leading space is part of the text node — trim handles it
			const location =
				$card.find('span.cities').first().text().trim() || undefined

			results.push({
				title,
				company,
				location,
				salary,
				salaryValueFrom,
				salaryValueTo,
				sourceUrl,
				position: ''
			})
		})

		return results
	}

	// ─── Detail page ─────────────────────────────────────────────────────────────

	/**
	 * DOU vacancy detail page — full description lives in .vacancy-section.b-typo
	 * If you need salary/location overrides from the detail page too,
	 * paste the detail page HTML and this method can be extended.
	 */
	private async fetchDetail(url: string): Promise<DetailEnrichment> {
		this.logger.debug(`Fetching detail: ${url}`)

		// DOU vacancy URLs are absolute (https://jobs.dou.ua/...)
		const html = await this.getAbsolute(url)
		const $ = cheerio.load(html)

		const description = (
			$('.vacancy-section.b-typo').text() || $('.b-typo').first().text()
		)
			.replace(/\s+/g, ' ')
			.trim()

		return { description }
	}

	// ─── Salary parsing ───────────────────────────────────────────────────────────

	/**
	 *   "$4000–6000"      -> { from: 4000, to: 6000 }
	 *   "від $3000"       -> { from: 3000 }
	 *   "до $5000"        -> { to: 5000 }
	 *   "$3000"           -> { from: 3000 }
	 */
	private parseSalary(raw: string | undefined): {
		salary?: string
		salaryValueFrom?: number
		salaryValueTo?: number
	} {
		if (!raw) return {}

		const salary = raw.trim()
		// Strip everything except digits and range separators (–, -)
		const normalized = salary.replace(/\s/g, '').replace(/[^\d–\-]/g, '')
		const parts = normalized
			.split(/[–\-]/)
			.map(Number)
			.filter(n => !isNaN(n) && n > 0)

		if (parts.length === 2)
			return {
				salary,
				salaryValueFrom: parts[0],
				salaryValueTo: parts[1]
			}

		if (parts.length === 1) {
			if (/від|from/i.test(salary))
				return { salary, salaryValueFrom: parts[0] }
			if (/до|up\s*to/i.test(salary))
				return { salary, salaryValueTo: parts[0] }
			return { salary, salaryValueFrom: parts[0] }
		}

		return { salary }
	}

	// ─── Debug helper ─────────────────────────────────────────────────────────────

	/** Enable with SCRAPPER_DEBUG=true */
	private debugSelectors($: cheerio.CheerioAPI): void {
		const probes: Record<string, number> = {
			'li.l-vacancy': $('li.l-vacancy').length,
			'a.vt': $('a.vt').length,
			'span.salary': $('span.salary').length,
			'span.cities': $('span.cities').length,
			'a.company': $('a.company').length
		}

		this.logger.debug(
			`Selector probes:\n${Object.entries(probes)
				.map(([k, v]) => `  ${k}: ${v}`)
				.join('\n')}`
		)

		const firstCard = $('li.l-vacancy').first().html()
		if (firstCard) {
			this.logger.debug(`First card HTML:\n${firstCard.slice(0, 1500)}`)
		} else {
			this.logger.warn('No li.l-vacancy found — dumping <body> fragment:')
			this.logger.debug($('body').html()?.slice(0, 2000) ?? '')
		}
	}

	// ─── HTTP ─────────────────────────────────────────────────────────────────────

	/** Relative path against baseURL */
	private async get(path: string): Promise<string> {
		const { data } = await this.http.get<string>(path)
		return data
	}

	/** Absolute URL — used for detail pages whose href is already full */
	private async getAbsolute(url: string): Promise<string> {
		const { data } = await this.http.get<string>(url, { baseURL: '' })
		return data
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}
