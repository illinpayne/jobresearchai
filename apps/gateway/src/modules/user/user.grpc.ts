import { Injectable } from '@nestjs/common'
import {AuthServiceClient } from "@jrai/contracts/gen/auth"
import type { ClientGrpc } from "@nestjs/microservices"
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'

//TODO: Add proto
@Injectable()
export class UserClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
  constructor(@InjectGrpcClient('USER_PACKAGE') client: ClientGrpc) {
    super(client, 'UserService');
  }
}
