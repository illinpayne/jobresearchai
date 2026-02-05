import { Injectable } from '@nestjs/common'
import {
	AccountCreateInput,
	AccountSelect,
	AccountUpdateInput,
	AccountWhereUniqueInput
} from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class AccountRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async getById(id: string, select?: AccountSelect) {
		const account = await this.prismaService.account.findUnique({
			where: { id },
			select: select
		})
		return account
	}

	public async getByEmail(email: string, select?: AccountSelect) {
		const account = await this.prismaService.account.findUnique({
			where: { email },
			select: select
		})
		return account
	}

	public async createAccount(
		input: AccountCreateInput,
		select?: AccountSelect
	) {
		const account = await this.prismaService.account.create({
			data: input,
			select: select
		})
		return account
	}

	public async updateAccount(
		uniquer: AccountWhereUniqueInput,
		updateData: AccountUpdateInput,
		select?: AccountSelect
	) {
		const account = await this.prismaService.account.update({
			where: uniquer,
			data: updateData,
			select: select
		})
		return account
	}
}
