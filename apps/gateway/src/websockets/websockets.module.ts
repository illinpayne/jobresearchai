import { Module } from '@nestjs/common'
import { ProgressGatewayModule } from './progress-gateway/progress-gateway.module';

@Module({
  imports: [ProgressGatewayModule]
})
export class WebsocketsModule {}
