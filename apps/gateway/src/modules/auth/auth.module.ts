import { GrpcModule } from '@jrai/contracts/grpc'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { GoogleStrategy } from '@/common/strategies/google.strategy'
import { JwtStrategy } from '@/common/strategies/jwt.strategy'
import { CookieModule } from '@/infrastructure/cookie-service/cookie-service.module'

import { AuthController } from './auth.controller'
import { AuthClientGrpc } from './auth.grpc'

@Module({
	imports: [
		PassportModule,
		GrpcModule.register(['AUTH_PACKAGE']),
		CookieModule
	],
	controllers: [AuthController],
	providers: [AuthClientGrpc, JwtStrategy, GoogleStrategy]
})
export class AuthModule {}
