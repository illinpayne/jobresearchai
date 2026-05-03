import { Module } from '@nestjs/common'

import { AiProviderModule } from './ai-provider/ai-provider.module'
import { QueueModule } from './queue/queue.module'
import { RmqModule } from './rmq/rmq.module'

@Module({
	imports: [RmqModule, AiProviderModule, QueueModule]
})
export class InfrastructureModule {}
