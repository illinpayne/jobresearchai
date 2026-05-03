import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { QueueClientName } from './queue.types'

@Injectable()
export class QueueService {
	public constructor(
		@Inject(QueueClientName) private readonly client: ClientProxy
	) {}

	public sendAnalysisProgress(message: string) {
		return this.client.emit('ai.exchange-resume.progress', message)
	}
}
