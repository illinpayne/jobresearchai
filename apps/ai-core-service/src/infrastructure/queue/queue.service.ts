import type { CreateVacancyEventType } from '@jrai/contracts'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { QueueClientName } from './queue.types'

@Injectable()
export class QueueService {
	public constructor(
		@Inject(QueueClientName) private readonly client: ClientProxy
	) {}

	public createJobForUser(data: CreateVacancyEventType) {
		return this.client.emit('job.create', data)
	}
}
