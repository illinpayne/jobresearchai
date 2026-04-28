import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { AiController } from './ai.controller'
import { AicoreClientGrpc } from './aicore.grpc'

@Module({
	imports: [GrpcModule.register(['AICORE_PACKAGE'])],
	providers: [AicoreClientGrpc],
	controllers: [AiController]
})
export class AiModule {}
