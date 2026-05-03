import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { RmqService } from '@/infrastructure/rmq/rmq.service'

@Controller()
export class ResumeExchangeQueueController {
	public constructor(private readonly rmqService: RmqService) {}

	@EventPattern('ai.exchange-resume.progress')
	public async Register(@Payload() data: string, @Ctx() ctx: RmqContext) {
		try {
			console.log(`Received progress: ${data}`)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}
}
