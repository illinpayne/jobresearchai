import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv, awsEnv } from '@/config/env'
import { InfrastructureModule } from '@/infrastructure/infrastructure.module'

import { rmqEnv } from './config/env/rmq.env'
import { ApplicationModule } from './modules/modules.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv, rmqEnv, awsEnv]
		}),
		InfrastructureModule,
		ApplicationModule
	]
})
export class AppModule {}
