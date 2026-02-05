import { Module } from '@nestjs/common'

import { TokenServiceModule } from '@/infrastructure/token-service/token-service.module'

import { AccountRepository } from '../account/account.repository'
import { OtpModule } from '../otp/otp.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [OtpModule, TokenServiceModule],
	controllers: [AuthController],
	providers: [AuthService, AccountRepository]
})
export class AuthModule {}
