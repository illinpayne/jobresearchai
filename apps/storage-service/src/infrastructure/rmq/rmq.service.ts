import { Injectable, Logger } from '@nestjs/common'
import { RmqContext } from '@nestjs/microservices'

@Injectable()
export class RmqService {
	private readonly logger = new Logger(RmqService.name)

	public ack(context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()
		const tag = originalMsg?.fields?.deliveryTag

		if (!tag) return

		channel.ack(originalMsg)
	}

	public nack(context: RmqContext, requeue = false) {
		const channel = context.getChannelRef()
		const originalMsg = context.getMessage()
		const tag = originalMsg?.fields?.deliveryTag

		if (!tag) return

		channel.nack(originalMsg, false, requeue)

		if (requeue) {
			this.logger.warn(
				`Nack with requeue (pattern: ${context.getPattern()}, tag: ${tag})`
			)
			return
		} else {
			this.logger.error(
				`Nack drop (pattern: ${context.getPattern()}, tag: ${tag})`
			)
		}
	}
}
