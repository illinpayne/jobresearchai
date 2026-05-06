import type { AiResumeUploadEventType } from '@jrai/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { RmqService } from '@/infrastructure/rmq/rmq.service'
import { delay } from '@/utils/delay'

import { ResumeService } from './resume.service'

@Controller()
export class ResumeController {
	public constructor(
		private readonly resumeService: ResumeService,
		private readonly rmqService: RmqService
	) {}

	@EventPattern('ai.resume.upload')
	public async Register(
		@Payload() data: AiResumeUploadEventType,
		@Ctx() ctx: RmqContext
	) {
		try {
			// Avoid unsynced UI race condition while UI transition and api request.
			await delay(1000)
			await this.resumeService.processResume(data)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}
}
