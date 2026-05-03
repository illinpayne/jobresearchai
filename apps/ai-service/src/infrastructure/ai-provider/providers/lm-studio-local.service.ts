import { Injectable } from '@nestjs/common'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'
import { QueueService } from '@/infrastructure/queue/queue.service'

import { IPromptModel } from '../models/prompt.model'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
@Injectable()
export class LMStudioLocalProvider implements AiProvider {
	public constructor(private readonly queue: QueueService) {}
	public async waitablePrompt(prompt: IPromptModel) {
		this.queue.sendAnalysisProgress('Analyse starts')
		await delay(1000)
		this.queue.sendAnalysisProgress('10% Something')
		await delay(1000)
		this.queue.sendAnalysisProgress('20% Something')
		await delay(1000)
		this.queue.sendAnalysisProgress('30% Something')
		await delay(1000)
		this.queue.sendAnalysisProgress('40% Something')
		await delay(1000)
		this.queue.sendAnalysisProgress('50% Something')
		await delay(1000)
		this.queue.sendAnalysisProgress('90% Something')
		await delay(1000)
		this.queue.sendAnalysisProgress('100% finish')
		return 'finish'
	}
	public streamPrompt(prompt: IPromptModel) {
		throw new Error('Method not implemented.')
	}
}
