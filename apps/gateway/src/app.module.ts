import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { appEnv } from '@/config/env'
import { AppsModule } from './modules/apps.module'

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, load: [appEnv]}),
    AppsModule,
  ],
})
export class AppModule {}
