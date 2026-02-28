import { Module } from '@nestjs/common'

import { AuthNotificationsModule } from './auth-notifications/auth-notifications.module'

@Module({
	imports: [AuthNotificationsModule]
})
export class ApplicationModule {}
