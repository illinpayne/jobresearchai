import { Module } from '@nestjs/common';
import { ServiceModule } from './modules/serivice.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config'
import { appEnv, jwtEnv, redisEnv } from './config/env'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [appEnv, jwtEnv, redisEnv] }), ServiceModule, InfrastructureModule],
})
export class AppModule {}
