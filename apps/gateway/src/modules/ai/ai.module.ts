import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { BillingClientGrpc } from '../billing/billing.grpc'

import { AiController } from './ai.controller'
import { AicoreClientGrpc } from './aicore.grpc'

@Module({
	imports: [GrpcModule.register(['AICORE_PACKAGE', 'PAYMENT_PACKAGE'])],
	providers: [AicoreClientGrpc, BillingClientGrpc],
	controllers: [AiController]
})
export class AiModule {}
