import type { AiProgressExchangeEventType } from '@jrai/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { RedisService } from '@/infrastructure/redis/redis.service'
import { RmqService } from '@/infrastructure/rmq/rmq.service'
import { jobNameCacheKey } from '@/shared/websockets'
import { ProgressGateway } from '@/websockets/progress-gateway/progress-gateway.gateway'

@Controller()
export class ResumeExchangeQueueController {
	public constructor(
		private readonly rmqService: RmqService,
		private readonly progressGateway: ProgressGateway,
		private readonly redisService: RedisService
	) {}

	@EventPattern('ai.exchange-resume.progress')
	public async Register(
		@Payload() payload: AiProgressExchangeEventType,
		@Ctx() ctx: RmqContext
	) {
		try {
			this.progressGateway.broadcastProgress(payload)

			if (payload.statusMessage === 'Done') {
				await this.redisService.del(
					`${jobNameCacheKey}:${payload.jobId}`
				)
			}
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}
}
