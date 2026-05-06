import { Injectable } from '@nestjs/common'
import {
	AiAnalyseJobCreateInput,
	AiAnalyseJobSelect,
	AiAnalyseJobUpdateInput,
	AiAnalyseJobWhereInput
} from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class AnalyseJobRepository {
	public readonly simplifiedJob: AiAnalyseJobSelect = {
		id: true,
		accountId: true,
		status: true
	}

	public readonly normalAnalyseJob: AiAnalyseJobSelect = {
		id: true,
		accountId: true,
		totalTokens: true,
		completionTokens: true,
		promptTokens: true,
		spentCredits: true,
		status: true,
		preset: {
			select: {
				id: true,
				name: true
			}
		}
	}

	public readonly fullAnalyseJob: AiAnalyseJobSelect = {
		id: true,
		accountId: true,
		totalTokens: true,
		completionTokens: true,
		promptTokens: true,
		spentCredits: true,
		status: true,
		preset: {
			select: {
				id: true,
				name: true,
				aiExternalModel: {
					select: {
						id: true,
						name: true
					}
				}
			}
		}
	}

	public readonly jobInProgress: AiAnalyseJobSelect = {
		id: true,
		status: true,
		preset: {
			select: {
				name: true
			}
		}
	}

	public constructor(private readonly prismaService: PrismaService) {}

	public async newJob(
		args: AiAnalyseJobCreateInput,
		select?: AiAnalyseJobSelect
	) {
		const job = await this.prismaService.aiAnalyseJob.create({
			data: args,
			select: select
		})
		return job
	}

	public async getJob(
		id: string,
		accountId: string,
		select: AiAnalyseJobSelect
	) {
		const job = await this.prismaService.aiAnalyseJob.findFirst({
			where: {
				id,
				accountId
			},
			select: select
		})
		return job
	}

	public async getJobs(
		filter: AiAnalyseJobWhereInput,
		select: AiAnalyseJobSelect
	) {
		const foundJobs = await this.prismaService.aiAnalyseJob.findMany({
			where: filter,
			select
		})
		return foundJobs
	}

	public async updateJob(
		id: string,
		accountId: string,
		args: AiAnalyseJobUpdateInput,
		select?: AiAnalyseJobSelect
	) {
		const job = await this.prismaService.aiAnalyseJob.update({
			where: {
				id,
				accountId
			},
			data: args,
			select: select
		})

		return job
	}
}
