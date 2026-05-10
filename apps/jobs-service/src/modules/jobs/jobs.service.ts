import {
	CreateJobRequest,
	GetJobByIdRequest,
	GetJobsRequest,
	Job,
	JobPaginationResponse
} from '@jrai/contracts/gen/job'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import { VacancyFindManyArgs, VacancySelect } from '@prisma/generated/models'

import { ScrappedJob } from '@/common/abstracts/scrapper-strategy.abstract'
import { createPaginator } from '@/infrastructure/pagination/pagination'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class JobsService {
	private readonly vacancySelection: VacancySelect = {
		id: true,
		title: true,
		description: true,
		salaryTo: true,
		salaryFrom: true,
		location: true,
		sourceUrl: true,
		createdAt: true
	} as const

	public constructor(private readonly prisma: PrismaService) {}

	public async createNewJobToUser(request: CreateJobRequest): Promise<Job> {
		const {
			title,
			description,
			salaryFrom,
			salaryTo,
			location,
			sourceUrl
		} = request
		const newJob = await this.prisma.userVacancy.create({
			data: {
				accountId: request.accountId,
				vacancy: {
					create: {
						title,
						description,
						salaryFrom,
						salaryTo,
						location,
						sourceUrl
					}
				}
			},
			select: {
				vacancy: {
					select: this.vacancySelection
				}
			}
		})
		return newJob.vacancy as Job
	}

	public async bulkNewJobToUser(
		accountId: string,
		scrappedJobs: ScrappedJob[]
	): Promise<void> {
		const bulkedJobs = await this.prisma.vacancy.createManyAndReturn({
			data: scrappedJobs
		})
		await this.prisma.userVacancy.createMany({
			data: bulkedJobs.map(j => {
				return {
					accountId,
					vacancyId: j.id
				}
			})
		})
	}

	public async getJobById(request: GetJobByIdRequest): Promise<Job> {
		const foundJob = await this.prisma.vacancy.findUnique({
			where: { id: request.id },
			select: this.vacancySelection
		})

		if (!foundJob) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Vacancy not found')
		}

		return foundJob as Job
	}

	public async getJobs(
		request: GetJobsRequest
	): Promise<JobPaginationResponse> {
		const page = request.chunk?.page ?? 1
		const limit = request.chunk?.limit ?? 10
		const paginate = createPaginator({ page, limit })

		const chunk = await paginate<Job, VacancyFindManyArgs>(
			this.prisma.vacancy,
			{
				where: {
					userVacancies: {
						some: { accountId: request.accountId }
					}
				},
				orderBy: { createdAt: 'desc' },
				select: this.vacancySelection
			},
			{ page, limit }
		)

		return chunk as JobPaginationResponse
	}
}
