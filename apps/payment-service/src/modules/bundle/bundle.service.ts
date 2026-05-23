import { Injectable, NotFoundException } from '@nestjs/common'
import { BundleSelect } from '@prisma/generated/models'

import { PaymentProvider } from '@/common/abstracts/payment-provider.abstract'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'

import { BuyBundleDto } from './dtos/buy-bundle.dto'

@Injectable()
export class BundleService {
	public bundle: BundleSelect = {
		id: true,
		name: true,
		credits: true,
		price: true,
		description: true
	}
	public constructor(
		private readonly prisma: PrismaService,
		private readonly paymentProvider: PaymentProvider
	) {}

	public async findAll() {
		return this.prisma.bundle.findMany({
			orderBy: { price: 'asc' },
			select: this.bundle
		})
	}

	public async findOne(id: string) {
		const bundle = await this.prisma.bundle.findUnique({ where: { id } })
		if (!bundle) throw new NotFoundException('Bundle not found')
		return bundle
	}

	public async buyBundle(dto: BuyBundleDto): Promise<{ url: string }> {
		const bundle = await this.findOne(dto.bundleId)
		if (!bundle) throw new NotFoundException('Bundle not found')

		const accountBill = await this.prisma.accountBill.findUnique({
			where: { accountId: dto.accountId }
		})

		if (!accountBill) {
			throw new NotFoundException('Bill not found')
		}

		const session = await this.paymentProvider.createPaymentSession({
			customerEmail: accountBill.email,
			priceId: bundle.stripePriceId,
			accountId: dto.accountId,
			bundleId: dto.bundleId
		})

		return { url: session.url! }
	}
}
