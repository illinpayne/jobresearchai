import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv, jwtEnv, redisEnv, rmqEnv } from '@/config/env'

import { oauthEnv } from './config/env/oauth.env'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ParserModule } from './infrastructure/parser/parser.module'
import { AppsModule } from './modules/apps.module'
import { WebsocketsModule } from './websockets/websockets.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv, jwtEnv, oauthEnv, rmqEnv, redisEnv],
			envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
		}),
		InfrastructureModule,
		AppsModule,
		ParserModule,
		WebsocketsModule
	]
})
export class AppModule {}
