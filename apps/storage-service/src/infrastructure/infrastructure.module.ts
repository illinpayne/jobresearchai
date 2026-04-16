import { Module } from '@nestjs/common'

import { QueueModule } from './queue/queue.module'
import { RmqModule } from './rmq/rmq.module'
import { StorageModule } from './storage/storage.module'

@Module({
	imports: [RmqModule, QueueModule, StorageModule]
})
export class InfrastructureModule {}
