import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'
import { AiConfig, AllConfigs } from '@/config/interfaces'
import { QueueService } from '@/infrastructure/queue/queue.service'

import { PromptModel } from '../models/prompt.model'
import { FREE_TIER_LLM_RULE, PAID_TIER_LLM_RULE } from '../rules/rules'

import {
	IProviderPromptResponse,
	IProviderUsageTokens
} from './ai-provider.response'

@Injectable()
export class LMStudioLocalProvider implements AiProvider, OnModuleInit {
	public constructor(
		private readonly queue: QueueService,
		private readonly config: ConfigService<AllConfigs>
	) {}
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
		const completion = await this.openai.chat.completions.create({
			model: prompt.llmName,
			temperature: prompt.temperature,
			max_tokens: prompt.maxTokens,
			messages: [
				{
					role: 'system',
					content:
						prompt.systemPrompt +
						'\n\n' +
						this.getRules(prompt.paidTier)
				},
				{
					role: 'user',
					content: `Analyse resume of candidate: ${prompt.extractedText}`
				}
			],
			response_format: {
				type: 'json_schema',
				json_schema: {
					name: 'customer_profile_schema',
					strict: true,
					schema: {
						type: 'object',
						properties: {
							firstName: { type: 'string' },
							lastName: { type: 'string' },
							yearsOld: { type: 'number' },
							location: { type: 'string' },
							predicatedPosition: { type: 'string' },
							currentPosition: { type: 'string' },
							resumeScore: {
								type: 'integer',
								minimum: 0,
								maximum: 100
							},
							summary: { type: 'string' },
							achivements: {
								type: 'array',
								items: { type: 'string' }
							},
							level: { type: 'string' },
							expectedSalaryFrom: { type: 'number' },
							expectedSalaryTo: { type: 'number' },
							tags: {
								type: 'array',
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
				totalTokens: completion.usage?.total_tokens,
				promptTokens: completion.usage.prompt_tokens,
				completionTokens: completion.usage.completion_tokens
			} as IProviderUsageTokens
		}
		const response: IProviderPromptResponse = {
			usage,
			rawData: completion.choices[0].message.content
		}
		return response
	}

	private getRules(paidTier: string): string {
		return paidTier.toLowerCase().includes('free')
			? FREE_TIER_LLM_RULE.trim()
			: PAID_TIER_LLM_RULE.trim()
	}

	public streamPrompt(prompt: PromptModel) {
		throw new Error('Method not implemented.')
	}
}
