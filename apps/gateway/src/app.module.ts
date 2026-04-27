import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv, jwtEnv } from '@/config/env'

import { oauthEnv } from './config/env/oauth.env'
import { AppsModule } from './modules/apps.module'
import { ParserModule } from './infrastructure/parser/parser.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv, jwtEnv, oauthEnv]
		}),
		AppsModule,
		ParserModule
	]
})
export class AppModule {}
