import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { ParserModule } from '@/infrastructure/parser/parser.module'

import { AicoreClientGrpc } from '../ai/aicore.grpc'

import { ResumeExchangeQueueController } from './resume-exchange-queue.controller'
import { ResumeController } from './resume.controller'

@Module({
	imports: [GrpcModule.register(['AICORE_PACKAGE']), ParserModule],
	providers: [AicoreClientGrpc],
	controllers: [ResumeController, ResumeExchangeQueueController]
})
export class ResumeModule {}
