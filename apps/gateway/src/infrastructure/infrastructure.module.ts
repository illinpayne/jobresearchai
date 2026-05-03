import { Module } from '@nestjs/common'

import { QueueModule } from './queue/queue.module'
import { RmqModule } from './rmq/rmq.module'

@Module({
	imports: [QueueModule, RmqModule]
})
export class InfrastructureModule {}
