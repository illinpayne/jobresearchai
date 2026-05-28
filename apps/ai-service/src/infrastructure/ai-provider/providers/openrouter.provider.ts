import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'
import { AiConfig, AllConfigs } from '@/config/interfaces'

import { PromptModel } from '../models/prompt.model'
import {
	IProviderPromptResponse,
	IProviderUsageTokens
} from '../responses/ai-provider.response'
import { FREE_TIER_RULES, PAID_TIER_RULES } from '../rules/rules'

@Injectable()
export class OpenrouterProvider implements AiProvider, OnModuleInit {
	public constructor(private readonly config: ConfigService<AllConfigs>) {}
	private openai: OpenAI

	onModuleInit() {
		const { url, apiKey } = this.config.get<AiConfig>('ai', {
			infer: true
		}) as AiConfig

		this.openai = new OpenAI({
			baseURL: url,
			apiKey: apiKey
		})
	}

	public async waitablePrompt(
		prompt: PromptModel
	): Promise<IProviderPromptResponse> {
		const rules = this.getRules(prompt.paidTier, prompt.ownRule)

		const MAX_RETRIES = 2
		const RETRY_DELAY_MS = 2000
		let lastError: unknown

		for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
			if (attempt > 0) {
				await new Promise(res =>
					setTimeout(res, RETRY_DELAY_MS * attempt)
				)
			}

			try {
				const completion = await this.openai.chat.completions.create({
					model: prompt.llmName,
					temperature: prompt.temperature,
					max_tokens: prompt.maxTokens,
					messages: [
						{ role: 'system', content: rules },
						{
							role: 'user',
							content:
								`Extract data from this resume text: ${prompt.extractedText}`.trim()
						}
					],
					// @ts-ignore — provider_preferences is OpenRouter-specific, not in openai types
					provider_preferences: {
						require_parameters: true // ensures model supports json_schema before routing
					},
					response_format: {
						type: 'json_schema',
						json_schema: {
							name: 'customer_profile_schema',
							strict: true,
							schema: {
								type: 'object',
								properties: {
									firstName: {
										type: 'string',
										description: 'Candidate first name'
									},
									lastName: {
										type: 'string',
										description: 'Candidate last name'
									},
									yearsOld: {
										type: 'number',
										description: 'Candidate age in years'
									},
									location: {
										type: 'string',
										description:
											'City and country of residence'
									},
									predicatedPosition: {
										type: 'string',
										description:
											'AI-predicted best-fit job title'
									},
									currentPosition: {
										type: 'string',
										description:
											'Current or most recent job title'
									},
									resumeScore: {
										type: 'integer',
										description:
											'Overall resume quality score from 0 to 100',
										minimum: 0,
										maximum: 100
									},
									summary: {
										type: 'string',
										description:
											'Short professional summary of the candidate'
									},
									achivements: {
										type: 'array',
										description:
											'List of notable achievements from the resume',
										items: { type: 'string' }
									},
									level: {
										type: 'string',
										description:
											'Seniority level, e.g. Junior, Middle, Senior'
									},
									expectedSalaryFrom: {
										type: 'number',
										description:
											'Lower bound of expected salary in USD'
									},
									expectedSalaryTo: {
										type: 'number',
										description:
											'Upper bound of expected salary in USD'
									},
									tags: {
										type: 'array',
										description:
											'Key skills and technologies extracted from the resume',
										items: { type: 'string' }
									}
								},
								required: [
									'firstName',
									'lastName',
									'yearsOld',
									'location',
									'predicatedPosition',
									'currentPosition',
									'resumeScore',
									'summary',
									'achivements',
									'level',
									'expectedSalaryFrom',
									'expectedSalaryTo',
									'tags'
								],
								additionalProperties: false
							}
						}
					}
				})

				let usage: IProviderUsageTokens | null = null
				if (completion.usage) {
					usage = {
						totalTokens: completion.usage.total_tokens,
						promptTokens: completion.usage.prompt_tokens,
						completionTokens: completion.usage.completion_tokens
					} as IProviderUsageTokens
				}

				const message = completion.choices[0].message
				let rawData = message.content

				if (!rawData || rawData.trim() === '') {
					rawData = (message as any).reasoning_content || ''
				}

				if (!rawData) {
					throw new Error('Empty response from model')
				}

				// Validate parseable before returning
				JSON.parse(rawData)

				return { usage, rawData }
			} catch (err: any) {
				lastError = err

				const is429 = err?.status === 429 || err?.code === 429
				const isEmptyResponse =
					err?.message === 'Empty response from model'
				const isJsonError = err instanceof SyntaxError

				if (
					(!is429 && !isEmptyResponse && !isJsonError) ||
					attempt === MAX_RETRIES - 1
				) {
					throw err
				}
			}
		}

		throw lastError
	}

	private getRules(paidTier: string, ownRule?: string): string {
		if (ownRule) {
			return ownRule.trim()
		}
		return paidTier.toLowerCase().includes('free')
			? FREE_TIER_RULES.trim()
			: PAID_TIER_RULES.trim()
	}

	public streamPrompt(prompt: PromptModel) {
		throw new Error('Method not implemented.')
	}
}
