import type { AiResumeUploadEvent } from '@jrai/contracts'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { QueueClientName } from './queue.types'

@Injectable()
export class QueueService {
	public constructor(
		@Inject(QueueClientName) private readonly client: ClientProxy
	) {}

	public async sendResumeToProcess(data: AiResumeUploadEvent) {
		return this.client.emit('ai.resume.upload', data)
	}
}
