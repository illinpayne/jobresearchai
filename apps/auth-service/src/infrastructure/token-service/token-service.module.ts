import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from '@/common/strategies/jwt.strategy'
import { AllConfigs } from '@/config/interfaces'
import { getJwtConfig } from '@/config/loaders'

import { TokenService } from './token-service.service'

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService<AllConfigs>]
		})
	],
	providers: [TokenService, JwtStrategy],
	exports: [TokenService]
})
export class TokenServiceModule {}
