import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AllConfigs } from '@/config/interfaces'

import { QueueService } from './queue.service'
import { QueueClientName } from './queue.types'

@Global()
@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: QueueClientName,
				useFactory: (config: ConfigService<AllConfigs>) => ({
					transport: Transport.RMQ,
					options: {
						urls: config.get('rmq.urls', { infer: true }),
						queue: config.get('rmq.ai_queue', { infer: true }),
						queueOptions: {
							durable: true
						}
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	providers: [QueueService],
	exports: [QueueService]
})
export class QueueModule {}
