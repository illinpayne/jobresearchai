import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountRepository } from '../account/account.repository'
import { OtpModule } from '../otp/otp.module'
import { TokenServiceModule } from '@/infrastructure/token-service/token-service.module'

@Module({
  imports: [OtpModule, TokenServiceModule],
  controllers: [AuthController],
  providers: [AuthService, AccountRepository],
})
export class AuthModule {}
