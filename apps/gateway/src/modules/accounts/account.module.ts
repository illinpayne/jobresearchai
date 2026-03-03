import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'

import { StorageClientGrpc } from '../storage/storage.grpc'

import { AccountController } from './account.controller'
import { AccountClientGrpc } from './account.grpc'

@Module({
	imports: [GrpcModule.register(['ACCOUNT_PACKAGE', 'STORAGE_PACKAGE'])],
	controllers: [AccountController],
	providers: [AccountClientGrpc, StorageClientGrpc]
})
export class AccountModule {}
