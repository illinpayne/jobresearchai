import {
	type AiProgressExchangeEventType,
	EventStatusCode
} from '@jrai/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { RedisService } from '@/infrastructure/redis/redis.service'
import { RmqService } from '@/infrastructure/rmq/rmq.service'
import { JobStatusCacheValue } from '@/shared/job-status.cache'
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
			const foundCacheValue = await this.redisService.get(
				`${jobNameCacheKey}:${payload.jobId}`
			)

			if (foundCacheValue) {
				const foundJobCacheParsedValue = JSON.parse(
					foundCacheValue
				) as JobStatusCacheValue

				const updatedJobCacheValue = JSON.stringify({
					email: foundJobCacheParsedValue?.email,
					lastMessage: payload.lastMessage,
					status: payload.status
				} as JobStatusCacheValue)

				await this.redisService.set(
					`${jobNameCacheKey}:${payload.jobId}`,
					updatedJobCacheValue,
					'EX',
					3600
				)
			}

			this.progressGateway.broadcastProgress(payload)

			if (
				payload.status === EventStatusCode.DONE ||
				payload.status === EventStatusCode.CANCELLED
			) {
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
