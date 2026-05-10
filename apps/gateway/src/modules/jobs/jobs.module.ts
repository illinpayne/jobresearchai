import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { JobClientGrpc } from './job.grpc'
import { JobsController } from './jobs.controller'

@Module({
	imports: [GrpcModule.register(['JOB_PACKAGE'])],
	controllers: [JobsController],
	providers: [JobClientGrpc]
})
export class JobsModule {}
