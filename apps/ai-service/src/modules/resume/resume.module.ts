import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { AiProviderModule } from '@/infrastructure/ai-provider/ai-provider.module'

import { AicoreClientGrpc } from '../aicore/aicore.grpc'
import { BillingClientGrpc } from '../billing/billing.grpc'

import { ResumeController } from './resume.controller'
import { ResumeService } from './resume.service'

@Module({
	imports: [
		GrpcModule.register(['AICORE_PACKAGE', 'PAYMENT_PACKAGE']),
		AiProviderModule
	],
	providers: [ResumeService, AicoreClientGrpc, BillingClientGrpc],
	controllers: [ResumeController]
})
export class ResumeModule {}
