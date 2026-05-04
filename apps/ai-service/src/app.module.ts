import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { aiEnv, appEnv, rmqEnv } from './config/env'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ModulesModule } from './modules/modules.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv, rmqEnv, aiEnv]
		}),
		InfrastructureModule,
		ModulesModule
	]
})
export class AppModule {}
