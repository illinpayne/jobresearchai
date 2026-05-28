import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OpenRouter } from '@openrouter/sdk'

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
	private openrouter: OpenRouter

	onModuleInit() {
		const { apiKey } = this.config.get<AiConfig>('ai', {
			infer: true
		}) as AiConfig

		this.openrouter = new OpenRouter({
			apiKey: apiKey
		})
	}

	public async waitablePrompt(
		prompt: PromptModel
	): Promise<IProviderPromptResponse> {
		const rules = this.getRules(prompt.paidTier, prompt.ownRule)

		const MAX_RETRIES = 3
		let lastError: unknown

		for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
			try {
				const response = await this.openrouter.chat.send({
					chatRequest: {
						model: prompt.llmName,
						temperature: prompt.temperature,
						maxTokens: prompt.maxTokens,
						messages: [
							{ role: 'system', content: rules },
							{
								role: 'user',
								content:
									`Extract data from this resume text: ${prompt.extractedText}`.trim()
							}
						],
						provider: {
							requireParameters: true
						},
						responseFormat: {
							type: 'json_schema',
							jsonSchema: {
								name: 'customer_profile_schema',
								strict: true,
								schema: {
									type: 'object',
									additionalProperties: false,
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
											description:
												'Candidate age in years'
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
												'Resume quality score 0–100',
											minimum: 0,
											maximum: 100
										},
										summary: {
											type: 'string',
											description:
												'Short professional summary'
										},
										achivements: {
											type: 'array',
											description: 'Notable achievements',
											items: { type: 'string' }
										},
										level: {
											type: 'string',
											description:
												'Seniority level e.g. Junior, Middle, Senior'
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
												'Key skills and technologies',
											items: { type: 'string' }
										}
									}
								}
							}
						}
					}
				})

				let usage: IProviderUsageTokens | null = null
				if (response.usage) {
					usage = {
						totalTokens: response.usage.totalTokens,
						promptTokens: response.usage.promptTokens,
						completionTokens: response.usage.completionTokens
					} as IProviderUsageTokens
				}

				const message = response.choices[0].message
				const rawData =
					message.content ?? (message as any).reasoning_content ?? ''

				if (!rawData.trim()) {
					throw new Error('Empty response from model')
				}

				JSON.parse(rawData)

				return { usage, rawData }
			} catch (err: any) {
				lastError = err

				const is429 = err?.status === 429 || err?.code === 429
				if (!is429 || attempt === MAX_RETRIES - 1) throw err

				const retryAfter =
					err?.error?.metadata?.retry_after_seconds ??
					Number(err?.headers?.get?.('retry-after') ?? 30)

				await new Promise(res => setTimeout(res, retryAfter * 1000))
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
