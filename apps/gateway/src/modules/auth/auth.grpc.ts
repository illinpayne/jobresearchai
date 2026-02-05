import { AuthServiceClient } from '@jrai/contracts/gen/auth'
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
	constructor(@InjectGrpcClient('AUTH_PACKAGE') client: ClientGrpc) {
		super(client, 'AuthService')
	}
}
