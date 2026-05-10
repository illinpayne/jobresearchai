import { Module } from '@nestjs/common'

import { PrismaModule } from './prisma/prisma.module'
import { RmqModule } from './rmq/rmq.module'

@Module({
	imports: [PrismaModule, RmqModule]
})
export class InfrastructureModule {}
