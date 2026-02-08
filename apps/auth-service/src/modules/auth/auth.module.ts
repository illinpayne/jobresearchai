import { Module } from '@nestjs/common'

import { TokenServiceModule } from '@/infrastructure/token-service/token-service.module'

import { AccountModule } from '../account/account.module'
import { OtpModule } from '../otp/otp.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [OtpModule, TokenServiceModule, AccountModule],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
