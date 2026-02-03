import { Module } from '@nestjs/common';
import { TokenService } from './token-service.service';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from '@/config/loaders'
import { PassportModule } from '@nestjs/passport'
import { AllConfigs } from '@/config/interfaces'
import { JwtStrategy } from '@/common/strategies/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService<AllConfigs>],
		}),
  ],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class TokenServiceModule {}
