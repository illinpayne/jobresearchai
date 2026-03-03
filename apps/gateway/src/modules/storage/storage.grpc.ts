import {
	STORAGE_SERVICE_NAME,
	StorageServiceClient
} from '@jrai/contracts/gen/storage'
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class StorageClientGrpc extends AbstractGrpcClient<StorageServiceClient> {
	constructor(@InjectGrpcClient('STORAGE_PACKAGE') client: ClientGrpc) {
		super(client, STORAGE_SERVICE_NAME)
	}
}
