import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AllConfigs } from '@/config/interfaces'

export function createRmqAiServer(
	app: INestApplication,
	config: ConfigService<AllConfigs>
) {
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: config.get('rmq.urls', { infer: true }),
			queue: config.get('rmq.ai_exchange_queue', { infer: true }),
			queueOptions: {
				durable: true
			},
			noAck: false,
			prefetchCount: 1,
			persistent: true
		}
	})
}
