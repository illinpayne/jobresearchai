import { type AiResumeUploadEventType, EventStatusCode } from '@jrai/contracts'
import {
	AnalyseStatus,
	CreateCustomerProfileRequest
} from '@jrai/contracts/gen/aicore'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'
import { PromptModel } from '@/infrastructure/ai-provider/models/prompt.model'
import {
	IProviderPromptResponse,
	IProviderUsageTokens
} from '@/infrastructure/ai-provider/responses/ai-provider.response'
import { QueueService } from '@/infrastructure/queue/queue.service'

import { AicoreClientGrpc } from '../aicore/aicore.grpc'
import { BillingClientGrpc } from '../billing/billing.grpc'

import { CustomerProfileDto } from './models/customer-profile.dto'

@Injectable()
export class ResumeService {
	public constructor(
		private readonly aiProvider: AiProvider,
		private readonly aiClient: AicoreClientGrpc,
		private readonly billingClient: BillingClientGrpc,
		private readonly queue: QueueService
	) {}

	public async processResume(payload: AiResumeUploadEventType) {
		const { jobId } = payload

		await this.putJobInWaiting(payload)
		this.queue.sendAnalysisProgress({
			lastMessage: 'Reasoning provided resume',
			jobId,
			status: EventStatusCode.WAITING
		})

		const aiResponse = await this.providerPrompt(payload)
		if (!aiResponse) {
			this.queue.sendAnalysisProgress({
				lastMessage: 'Invalid response from AI',
				jobId,
				status: EventStatusCode.CANCELLED
			})
			await this.cancellJob(payload)
			return
		}

		try {
			this.queue.sendAnalysisProgress({
				lastMessage: 'Working on response',
				jobId,
				status: EventStatusCode.WAITING
			})
			const parsedRaw = JSON.parse(aiResponse.rawData)
			const customerProfileDto = plainToInstance(
				CustomerProfileDto,
				parsedRaw
			)

			const validationErrors = await validate(customerProfileDto)
			if (validationErrors.length > 0) {
				this.queue.sendAnalysisProgress({
					lastMessage: 'Failed to confirm response',
					jobId,
					status: EventStatusCode.CANCELLED
				})
				await this.cancellJob(payload)
				return
			}

			// Here we can take off tokens from user.
			const usage = aiResponse.usage
			if (usage) {
				await this.completeJob(payload, usage)
			}

			const customerProfileRequest: CreateCustomerProfileRequest = {
				profile: {
					accountId: payload.accountId,
					...customerProfileDto
				},
				jobId: payload.jobId
			}

			await this.aiClient.call('createProfile', customerProfileRequest)
			this.queue.sendAnalysisProgress({
				lastMessage: 'Done',
				jobId,
				status: EventStatusCode.DONE
			})

			await this.billingClient.call('decrementBillCredits', {
				accountId: payload.accountId,
				credits: payload.preset.usageCredits
			})
		} catch (error: any) {
			if (
				aiResponse.usage?.completionTokens === payload.preset.maxTokens
			) {
				this.queue.sendAnalysisProgress({
					lastMessage:
						'Cannot analyse resume, resume is too large for this model',
					jobId,
					status: EventStatusCode.CANCELLED
				})
				await this.cancellJob(payload)
				return
			}
			this.queue.sendAnalysisProgress({
				lastMessage: 'Failed to proceed the analysis',
				jobId,
				status: EventStatusCode.CANCELLED
			})

			await this.cancellJob(payload)
			return
		}
	}

	async providerPrompt(
		payload: AiResumeUploadEventType
	): Promise<IProviderPromptResponse | null> {
		const { jobId } = payload

		try {
			return await this.aiProvider.waitablePrompt({
				extractedText: payload.extractedText,
				llmName: payload.preset.llmName,
				temperature: payload.preset.temperature,
				paidTier: payload.preset.paidTier,
				systemPrompt: payload.preset.systemPrompt,
				maxTokens: payload.preset.maxTokens,
				ownRule: payload.preset.ownRule
			} as PromptModel)
		} catch (error) {
			this.queue.sendAnalysisProgress({
				lastMessage: 'Failed to process the resume',
				jobId,
				status: EventStatusCode.CANCELLED
			})
			return null
		}
	}

	private async putJobInWaiting(payload: AiResumeUploadEventType) {
		try {
			await this.aiClient.call('updateAnalyseJob', {
				id: payload.jobId,
				accountId: payload.accountId,
				status: AnalyseStatus.WAITING
			})
		} catch (error) {}
	}

	private async cancellJob(payload: AiResumeUploadEventType) {
		try {
			await this.aiClient.call('updateAnalyseJob', {
				id: payload.jobId,
				accountId: payload.accountId,
				status: AnalyseStatus.CANCELLED
			})
		} catch (error) {}
	}

	private async completeJob(
		payload: AiResumeUploadEventType,
		usage: IProviderUsageTokens
	) {
		try {
			await this.aiClient.call('updateAnalyseJob', {
				id: payload.jobId,
				accountId: payload.accountId,
				totalTokens: usage.totalTokens,
				completionTokens: usage.completionTokens,
				promptTokens: usage.promptTokens,
				spentCredits: payload.preset.usageCredits,
				status: AnalyseStatus.DONE
			})
		} catch (error) {}
	}
}
