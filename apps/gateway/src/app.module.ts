import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv, jwtEnv } from '@/config/env'

import { AppsModule } from './modules/apps.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [appEnv, jwtEnv] }),
		AppsModule
	]
})
export class AppModule {}
