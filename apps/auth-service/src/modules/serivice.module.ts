import { Module } from '@nestjs/common'

import { AccountModule } from './account/account.module'
import { AuthModule } from './auth/auth.module'
import { OtpModule } from './otp/otp.module'

@Module({
	imports: [AuthModule, AccountModule, OtpModule]
})
export class ServiceModule {}
