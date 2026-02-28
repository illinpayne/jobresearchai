import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { appEnv, jwtEnv, redisEnv } from './config/env'
import { rmqEnv } from './config/env/rmq.env'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ServiceModule } from './modules/serivice.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appEnv, jwtEnv, redisEnv, rmqEnv]
		}),
		ServiceModule,
		InfrastructureModule
	]
})
export class AppModule {}
