import {
	PAYMENT_SERVICE_NAME,
	PaymentServiceClient
} from '@jrai/contracts/gen/payment'
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class BillingClientGrpc extends AbstractGrpcClient<PaymentServiceClient> {
	constructor(@InjectGrpcClient('PAYMENT_PACKAGE') client: ClientGrpc) {
		super(client, PAYMENT_SERVICE_NAME)
	}
}
