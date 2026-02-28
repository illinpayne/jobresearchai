import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AllConfigs } from '@/config/interfaces'

import { MessagingService } from './messaging.service'
import { MessagingQueueName } from './messaging.types'

@Global()
@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: MessagingQueueName,
				useFactory: (config: ConfigService<AllConfigs>) => ({
					transport: Transport.RMQ,
					options: {
						urls: config.get('rmq.urls', { infer: true }),
						queue: config.get('rmq.queue', { infer: true }),
						queueOptions: {
							durable: true
						}
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	providers: [MessagingService],
	exports: [MessagingService]
})
export class MessagingModule {}
