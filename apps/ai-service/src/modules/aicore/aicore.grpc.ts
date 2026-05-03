import {
	AI_CORE_SERVICE_NAME,
	AICoreServiceClient
} from '@jrai/contracts/gen/aicore'
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class AicoreClientGrpc extends AbstractGrpcClient<AICoreServiceClient> {
	constructor(@InjectGrpcClient('AICORE_PACKAGE') client: ClientGrpc) {
		super(client, AI_CORE_SERVICE_NAME)
	}
}
