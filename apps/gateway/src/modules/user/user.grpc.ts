import { AuthServiceClient } from '@jrai/contracts/gen/auth'
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

//TODO: Add proto
@Injectable()
export class UserClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
	constructor(@InjectGrpcClient('USER_PACKAGE') client: ClientGrpc) {
		super(client, 'UserService')
	}
}
