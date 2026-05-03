import { AiResumeUploadEvent } from '@jrai/contracts'
import { Injectable } from '@nestjs/common'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'
import { IPromptModel } from '@/infrastructure/ai-provider/models/prompt.model'

import { AicoreClientGrpc } from '../aicore/aicore.grpc'

@Injectable()
export class ResumeService {
	public constructor(
		private readonly aiProvider: AiProvider,
		private readonly aiClient: AicoreClientGrpc
	) {}

	public async processResume(payload: AiResumeUploadEvent) {
		const response = await this.aiProvider.waitablePrompt(
			payload as IPromptModel
		)
		console.log(`Response: ${response}`)
	}
}
