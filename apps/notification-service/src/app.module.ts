import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv, redisEnv, smtpEnv } from '@/config/env'

import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ApplicationModule } from './modules/application.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv, redisEnv, smtpEnv],
			envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
		}),
		InfrastructureModule,
		ApplicationModule
	]
})
export class AppModule {}
