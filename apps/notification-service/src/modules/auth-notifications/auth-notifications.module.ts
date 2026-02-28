import { Module } from '@nestjs/common'

import { MailModule } from '@/infrastructure/mail/mail.module'

import { AuthNotificationsController } from './auth-notifications.controller'
import { AuthNotificationsService } from './auth-notifications.service'

@Module({
	imports: [MailModule],
	controllers: [AuthNotificationsController],
	providers: [AuthNotificationsService]
})
export class AuthNotificationsModule {}
