import { JOB_SERVICE_NAME, JobServiceClient } from '@jrai/contracts/gen/job'
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class JobClientGrpc extends AbstractGrpcClient<JobServiceClient> {
	public constructor(@InjectGrpcClient('JOB_PACKAGE') client: ClientGrpc) {
		super(client, JOB_SERVICE_NAME)
	}
}
