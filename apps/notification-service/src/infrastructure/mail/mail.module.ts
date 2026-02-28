import { MailerModule } from '@nestjs-modules/mailer'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import {
	ExtendedMailService,
	MailService
} from '@/common/abstractions/mail.service.abstract'
import { getMailerConfig } from '@/config/loaders'

import { MailProcessor } from './mail.processor'
import { MailerService } from './mailers/mailer.service'

// import { ResendService } from './mailers/resend.service'

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMailerConfig,
			inject: [ConfigService]
		}),
		BullModule.registerQueue({
			name: 'mail',
			defaultJobOptions: {
				attempts: 2,
				backoff: {
					type: 'exponential',
					delay: 5000
				},
				removeOnComplete: true
			}
		})
	],
	providers: [
		{
			provide: MailService,
			useClass: MailerService
		},
		{
			provide: ExtendedMailService,
			useExisting: MailService
		},
		MailProcessor
	],
	exports: [MailService]
})
export class MailModule {}
