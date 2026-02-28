import { Module } from '@nestjs/common'

import { MessagingModule } from './messaging/messaging.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [PrismaModule, RedisModule, MessagingModule]
})
export class InfrastructureModule {}
