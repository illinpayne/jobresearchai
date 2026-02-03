import { Injectable } from '@nestjs/common'
import {AuthServiceClient } from "@jrai/contracts/gen/auth"
import type { ClientGrpc } from "@nestjs/microservices"
import { AbstractGrpcClient, InjectGrpcClient } from '@jrai/contracts/grpc'

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
  constructor(@InjectGrpcClient('AUTH_PACKAGE') client: ClientGrpc) {
    super(client, 'AuthService');
  }
}
