import { Injectable } from '@nestjs/common'
import {
	CustomerProfileCreateInput,
	CustomerProfileSelect
} from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class ProfileRepository {
	public readonly profileSelect: CustomerProfileSelect = {
		id: true,
		accountId: true,
		firstName: true,
		lastName: true,
		yearsOld: true,
		location: true,
		predicatedPosition: true,
		currentPosition: true,
		resumeScore: true,
		summary: true,
		achivements: true,
		level: true,
		expectedSalaryFrom: true,
		expectedSalaryTo: true,
		tags: true
	} as const

	public readonly profileSecureSelect: CustomerProfileSelect = {
		id: true,
		firstName: true,
		lastName: true,
		yearsOld: true,
		location: true,
		predicatedPosition: true,
		currentPosition: true,
		resumeScore: true,
		summary: true,
		achivements: true,
		level: true,
		expectedSalaryFrom: true,
		expectedSalaryTo: true,
		tags: true,
		job: {
			select: {
				spentCredits: true,
				preset: {
					select: {
						name: true
					}
				}
			}
		}
	} as const
	public constructor(private readonly prismaService: PrismaService) {}

	public async createProfile(args: CustomerProfileCreateInput) {
		const profile = await this.prismaService.customerProfile.create({
			data: args
		})

		return profile
	}

	public async getProfileGyId(id: string, select?: CustomerProfileSelect) {
		const profile = await this.prismaService.customerProfile.findUnique({
			where: { id },
			select
		})
		return profile
	}

	public async getAllAccountProfiles(
		accountId: string,
		select?: CustomerProfileSelect
	) {
		const profiles = await this.prismaService.customerProfile.findMany({
			where: { accountId },
			include: {
				// ...select
				job: {
					select: {
						spentCredits: true,
						preset: {
							select: {
								name: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		return profiles
	}
}
