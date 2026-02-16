import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { AccountController } from './account.controller'
import { AccountClientGrpc } from './account.grpc'

@Module({
	imports: [GrpcModule.register(['ACCOUNT_PACKAGE'])],
	controllers: [AccountController],
	providers: [AccountClientGrpc]
})
export class AccountModule {}
