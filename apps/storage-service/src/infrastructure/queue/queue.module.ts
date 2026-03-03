import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AllConfigs } from '@/config/interfaces'

import { QueueName } from './queue.types'

@Global()
@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: QueueName,
				useFactory: (config: ConfigService<AllConfigs>) => ({
					transport: Transport.RMQ,
					options: {
						urls: [config.get('rmq.url', { infer: true })],
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
	exports: [ClientsModule]
})
export class QueueModule {}
