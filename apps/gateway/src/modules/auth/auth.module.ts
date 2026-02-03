import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcModule } from '@jrai/contracts/grpc'
import { AuthClientGrpc } from './auth.grpc'
import { CookieModule } from '@/infrastructure/cookie-service/cookie-service.module'

@Module({
  imports: [GrpcModule.register(['AUTH_PACKAGE']), CookieModule],
  controllers: [AuthController],
  providers: [AuthClientGrpc]
})
export class AuthModule {}
