import type { AiResumeUploadEvent } from '@jrai/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { RmqService } from '@/infrastructure/rmq/rmq.service'

import { ResumeService } from './resume.service'

@Controller()
export class ResumeController {
	public constructor(
		private readonly resumeService: ResumeService,
		private readonly rmqService: RmqService
	) {}

	@EventPattern('ai.resume.upload')
	public async Register(
		@Payload() data: AiResumeUploadEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.resumeService.processResume(data)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}
}
