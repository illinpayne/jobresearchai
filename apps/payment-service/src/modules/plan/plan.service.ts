import { Injectable, NotFoundException } from '@nestjs/common'
import { PlanSelect } from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class PlanService {
	public plan: PlanSelect = {
		id: true,
		name: true,
		description: true,
		grantedCredits: true,
		trialDays: true,
		monthlyPrice: true,
		annualPrice: true,
		benefits: true
	}
	public constructor(private readonly prisma: PrismaService) {}

	public async findAll() {
		return this.prisma.plan.findMany({
			orderBy: { createdAt: 'asc' },
			select: this.plan
		})
	}

	public async findOne(id: string) {
		const plan = await this.prisma.plan.findUnique({ where: { id } })
		if (!plan) throw new NotFoundException('Plan not found')
		return plan
	}
}
