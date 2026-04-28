import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv } from './config/env'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ModulesModule } from './modules/modules.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv]
		}),
		InfrastructureModule,
		ModulesModule
	]
})
export class AppModule {}
