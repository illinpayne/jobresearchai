import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getBullmqLoader } from '@/config/loaders'

import { MailModule } from './mail/mail.module'
import { RmqModule } from './rmq/rmq.module'

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getBullmqLoader,
			inject: [ConfigService]
		}),
		MailModule,
		RmqModule
	]
})
export class InfrastructureModule {}
