import { Module } from '@nestjs/common'

import { ProgressGateway } from './progress-gateway.gateway'

@Module({
	providers: [ProgressGateway],
	exports: [ProgressGateway]
})
export class ProgressGatewayModule {}
