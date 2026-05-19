import { CreateAccountBillRequest } from '@jrai/contracts/gen/payment'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

import { UpdateAccountBillDto } from './dtos/update-account-bill.dto'

@Injectable()
export class AccountBillService {
	public constructor(private readonly prisma: PrismaService) {}

	public async create(dto: CreateAccountBillRequest) {
		const existing = await this.prisma.accountBill.findUnique({
			where: { accountId: dto.accountId }
		})

		if (existing) return existing

		return this.prisma.accountBill.create({
			data: {
				accountId: dto.accountId,
				email: dto.email,
				credits: 30
			}
		})
	}

	public async findOne(accountId: string) {
		const accountBill = await this.prisma.accountBill.findUnique({
			where: { accountId }
		})

		if (!accountBill)
			throw new GrpcException(
				RpcStatus.NOT_FOUND,
				'Account bill information not found'
			)

		return accountBill
	}

	public async update(accountId: string, dto: UpdateAccountBillDto) {
		await this.findOne(accountId)

		return this.prisma.accountBill.update({
			where: { accountId },
			data: {
				credits: dto.credits
			}
		})
	}

	public async ensureExists(accountId: string, email: string) {
		return await this.prisma.accountBill.upsert({
			where: { accountId },
			create: { accountId, email, credits: 0 },
			update: {}
		})
	}

	public async setCredits(accountId: string, credits: number) {
		return await this.prisma.accountBill.update({
			where: { accountId },
			data: { credits }
		})
	}

	public async incrementCredits(accountId: string, credits: number) {
		return await this.prisma.accountBill.update({
			where: { accountId },
			data: { credits: { increment: credits } }
		})
	}
}
