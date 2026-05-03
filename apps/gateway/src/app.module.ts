import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv, jwtEnv, rmqEnv } from '@/config/env'

import { oauthEnv } from './config/env/oauth.env'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ParserModule } from './infrastructure/parser/parser.module'
import { AppsModule } from './modules/apps.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv, jwtEnv, oauthEnv, rmqEnv]
		}),
		InfrastructureModule,
		AppsModule,
		ParserModule
	]
})
export class AppModule {}
