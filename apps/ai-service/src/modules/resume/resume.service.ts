import type { AiResumeUploadEventType } from '@jrai/contracts'
import { AnalyseStatus, CustomerProfile } from '@jrai/contracts/gen/aicore'
import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'
import {
	IProviderPromptResponse,
	IProviderUsageTokens
} from '@/infrastructure/ai-provider/providers/ai-provider.response'
import { QueueService } from '@/infrastructure/queue/queue.service'

import { AicoreClientGrpc } from '../aicore/aicore.grpc'

import { CustomerProfileDto } from './models/customer-profile.dto'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

@Injectable()
export class ResumeService {
	public constructor(
		private readonly aiProvider: AiProvider,
		private readonly aiClient: AicoreClientGrpc,
		private readonly queue: QueueService
	) {}

	public async processResume(payload: AiResumeUploadEventType) {
		const { jobId, accountId } = payload
		await this.createJob(payload)
		this.queue.sendAnalysisProgress({
			statusMessage: 'Reasoning provided resume',
			jobId,
			accountId
		})
		const aiResponse = await this.providerPrompt(payload)

		if (!aiResponse) {
			return
		}

		try {
			this.queue.sendAnalysisProgress({
				statusMessage: 'Working on response',
				jobId,
				accountId
			})

			const parsedRaw = JSON.parse(aiResponse.rawData)
			const customerProfileDto = plainToInstance(
				CustomerProfileDto,
				parsedRaw
			)

			const validationErrors = await validate(customerProfileDto)
			if (validationErrors.length > 0) {
				this.queue.sendAnalysisProgress({
					statusMessage: 'Failed to confirm response',
					jobId,
					accountId
				})
				await this.cancellJob(payload)
				return
			}

			// Here we can take off tokens from user.
			const usage = aiResponse.usage
			if (usage) {
				await this.completeJob(payload, usage)
			}

			const customerProfile: CustomerProfile = {
				accountId: payload.accountId,
				...customerProfileDto
			}

			await this.aiClient.call('createProfile', customerProfile)
			this.queue.sendAnalysisProgress({
				statusMessage: 'Done',
				jobId,
				accountId
			})
		} catch (error: any) {
			if (
				aiResponse.usage?.completionTokens === payload.preset.maxTokens
			) {
				this.queue.sendAnalysisProgress({
					statusMessage:
						'Cannot analyse resume, resume is too large for this model',
					jobId,
					accountId
				})
				return
			} else {
				this.queue.sendAnalysisProgress({
					statusMessage: 'Failed to proceed the analysis',
					jobId,
					accountId
				})
			}

			await this.cancellJob(payload)
			return
		}
	}

	async providerPrompt(
		payload: AiResumeUploadEventType
	): Promise<IProviderPromptResponse | null> {
		const { jobId, accountId } = payload
		try {
			// return await this.aiProvider.waitablePrompt({
			// 	extractedText: payload.extractedText,
			// 	llmName: payload.preset.llmName,
			// 	temperature: payload.preset.temperature,
			// 	paidTier: payload.preset.paidTier,
			// 	systemPrompt: payload.preset.systemPrompt,
			// 	maxTokens: payload.preset.maxTokens
			// } as PromptModel)
			await delay(10000)
			return {
				usage: {
					totalTokens: 1000,
					promptTokens: 300,
					completionTokens: 700
				},
				rawData:
					'{"firstName": "STANISLAV", "lastName": "TARNOHURSKYI", "yearsOld": 20, "location": "Ukraine", "predicatedPosition": "Senior Full Stack Developer", "currentPosition": "Full Stack Developer", "resumeScore": 85, "summary": "A dedicated Full-Stack Developer with over 4 years of experience specializing in building robust web solutions for the healthcare sector. Proficient across the MERN/PERN stack, .NET Core, and modern frontend frameworks (React, NextJS). Proven ability to architect scalable systems and automate development processes.", "achivements": ["Developed over five full-stack applications contributing to healthcare digital solutions.", "Developed a comprehensive Node.js CLI tool that automates the full-stack development and deployment process, streamlining front-end and back-end scaffolding with cloud-agnostic deployment solutions."], "level": "Junior - Middle Full Stack", "expectedSalaryFrom": 18000, "expectedSalaryTo": 35000, "tags": ["Full Stack Development", "React", "Node.js", " .NET", "Backend Development", "API Development", "Cloud Deployment"]}'
			}
		} catch (error) {
			this.queue.sendAnalysisProgress({
				statusMessage: 'Failed to process the resume',
				jobId,
				accountId
			})
			await this.cancellJob(payload)
			return null
		}
	}

	private async createJob(payload: AiResumeUploadEventType) {
		try {
			await this.aiClient.call('createAnalyseJob', {
				id: payload.jobId,
				accountId: payload.accountId,
				presetId: payload.preset.presetId,
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
