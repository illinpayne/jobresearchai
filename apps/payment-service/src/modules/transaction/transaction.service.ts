import { Injectable } from '@nestjs/common'
import { TransactionStatus, TransactionType } from '@prisma/generated/enums'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class TransactionService {
	public constructor(private readonly prisma: PrismaService) {}

	public async findAllByAccount(accountId: string) {
		return this.prisma.transaction.findMany({
			where: { accountId },
			orderBy: { createdAt: 'desc' },
			include: { subscription: true, bundle: true }
		})
	}

	public async create(data: {
		accountId: string
		type: TransactionType
		status: TransactionStatus
		stripePaymentIntentId?: string
		stripeInvoiceId?: string
		subscriptionId?: string
		bundleId?: string
	}) {
		return this.prisma.transaction.create({ data })
	}
}
