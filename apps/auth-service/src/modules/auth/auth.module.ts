import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { TokenServiceModule } from '@/infrastructure/token-service/token-service.module'

import { AccountModule } from '../account/account.module'
import { OtpModule } from '../otp/otp.module'
import { PaymentClientGrpc } from '../payment/payment.grpc'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		GrpcModule.register(['PAYMENT_PACKAGE']),
		OtpModule,
		TokenServiceModule,
		AccountModule
	],
	controllers: [AuthController],
	providers: [AuthService, PaymentClientGrpc]
})
export class AuthModule {}
