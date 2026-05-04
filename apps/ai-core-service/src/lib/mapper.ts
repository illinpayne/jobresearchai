import { AnalyseStatus as ProtoStatuses } from '@jrai/contracts/gen/aicore'
import { AnalyseStatus as PrismaStatuses } from '@prisma/generated/enums'

export const statusMapper: Record<ProtoStatuses, PrismaStatuses> = {
	[ProtoStatuses.WAITING]: PrismaStatuses.WAITING,
	[ProtoStatuses.DONE]: PrismaStatuses.DONE,
	[ProtoStatuses.CANCELLED]: PrismaStatuses.CANCELLED,
	[ProtoStatuses.UNRECOGNIZED]: PrismaStatuses.WAITING
}

export const statusMapperExchange: Record<PrismaStatuses, ProtoStatuses> = {
	[PrismaStatuses.WAITING]: ProtoStatuses.WAITING,
	[PrismaStatuses.DONE]: ProtoStatuses.DONE,
	[PrismaStatuses.CANCELLED]: ProtoStatuses.CANCELLED
}
