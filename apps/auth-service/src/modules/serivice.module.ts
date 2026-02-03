import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'
import { AccountModule } from './account/account.module';
import { OtpModule } from './otp/otp.module';

@Module({
imports: [AuthModule, AccountModule, OtpModule]
})
export class ServiceModule {}
