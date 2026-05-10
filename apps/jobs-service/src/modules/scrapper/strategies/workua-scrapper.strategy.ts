import { Injectable } from '@nestjs/common'
import { CheerioCrawler } from 'crawlee'

import {
	ScrappedJob,
	ScrapperPayload,
	ScrapperStrategy
} from '@/common/abstracts/scrapper-strategy.abstract'

export const WORKUA_STRATEGY_TOKEN = Symbol('WORKUA_STRATEGY_TOKEN')

@Injectable()
export class WorkuaScrapperStrategy implements ScrapperStrategy {
	public async scrape(payload: ScrapperPayload): Promise<ScrappedJob[]> {
		const jobs: ScrappedJob[] = []
		const { tags, location, limit } = payload

		const searchKeywords = tags.map(tag => tag.trim()).join('+')
		const url = `https://www.work.ua/jobs-${encodeURIComponent(searchKeywords)}/`
		const crawler = new CheerioCrawler({
			maxRequestsPerCrawl: limit,
			requestHandler: async ({ $, request }) => {
				$('.card-hover').each((_, element) => {
					const $el = $(element)
					const titleLink = $el.find('h2 a')
					const salaryText = $el.find('span.strong-600').text().trim()

					const { from, to } = this.parseSalary(salaryText)

					const job: ScrappedJob = {
						title: titleLink.text().trim(),
						description: $el.find('p.text-muted').text().trim(),
						salaryFrom: from,
						salaryTo: to,
						location: location || 'Ukraine',
						sourceUrl: `https://www.work.ua${titleLink.attr('href')}`
					}

					if (job.title && job.sourceUrl) {
						jobs.push(job)
					}
				})

				if (jobs.length >= limit) {
					// This prevents the crawler from picking up more URLs from the queue
					await crawler.autoscaledPool?.abort()
				}
			}
		})

		await crawler.run([url])
		return jobs
	}

	private parseSalary(salaryStr: string): { from?: number; to?: number } {
		if (!salaryStr) return { from: undefined, to: undefined }
		const numberChunks = salaryStr.match(/(\d[\d\s\u202F\u2009\u00A0]*)/g)

		if (!numberChunks) return { from: undefined, to: undefined }

		const numbers = numberChunks
			.map(chunk => chunk.replace(/[\s\u202F\u2009\u00A0]/g, ''))
			.filter(cleaned => cleaned.length > 0)
			.map(cleaned => parseInt(cleaned, 10))

		return {
			from: numbers.length >= 1 ? numbers[0] : undefined,

			to: numbers.length >= 2 ? numbers[1] : undefined
		}
	}
}
