import { Module } from '@nestjs/common'

import { QueueModule } from './queue/queue.module'
import { RmqModule } from './rmq/rmq.module'
import { StorageModule } from './storage/storage.module'

@Module({
	imports: [RmqModule, StorageModule, QueueModule]
})
export class InfrastructureModule {}
