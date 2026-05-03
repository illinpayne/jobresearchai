import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { AiProviderModule } from '@/infrastructure/ai-provider/ai-provider.module'

import { AicoreClientGrpc } from '../aicore/aicore.grpc'

import { ResumeController } from './resume.controller'
import { ResumeService } from './resume.service'

@Module({
	imports: [GrpcModule.register(['AICORE_PACKAGE']), AiProviderModule],
	providers: [ResumeService, AicoreClientGrpc],
	controllers: [ResumeController]
})
export class ResumeModule {}
