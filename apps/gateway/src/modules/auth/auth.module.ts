import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcModule } from '@jrai/contracts/grpc'
import { AuthClientGrpc } from './auth.grpc'
import { CookieModule } from '@/infrastructure/cookie-service/cookie-service.module'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '@/common/strategies/jwt.strategy'

@Module({
  imports: [PassportModule, GrpcModule.register(['AUTH_PACKAGE']), CookieModule],
  controllers: [AuthController],
  providers: [AuthClientGrpc, JwtStrategy]
})
export class AuthModule {}
