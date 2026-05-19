import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { BillingController } from './billing.controller'
import { BillingClientGrpc } from './billing.grpc'
import { BillingService } from './billing.service'

@Module({
	imports: [GrpcModule.register(['PAYMENT_PACKAGE'])],
	controllers: [BillingController],
	providers: [BillingService, BillingClientGrpc]
})
export class BillingModule {}
