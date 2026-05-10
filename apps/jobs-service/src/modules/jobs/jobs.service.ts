import {
	CreateJobRequest,
	GetJobByIdRequest,
	GetJobFilterResponse,
	GetJobsRequest,
	Job,
	JobPaginationResponse
} from '@jrai/contracts/gen/job'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import {
	VacancyFindManyArgs,
	VacancySelect,
	VacancyWhereInput
} from '@prisma/generated/models'

import { ScrappedJob } from '@/common/abstracts/scrapper-strategy.abstract'
import { createPaginator } from '@/infrastructure/pagination/pagination'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class JobsService {
	private readonly vacancySelection: VacancySelect = {
		id: true,
		title: true,
		company: true,
		description: true,
		salary: true,
		position: true,
		location: true,
		sourceUrl: true
	} as const

	public constructor(private readonly prisma: PrismaService) {}

	public async createNewJobToUser(request: CreateJobRequest): Promise<Job> {
		const {
			title,
			description,
			salary,
			position,
			location,
			company,
			sourceUrl
		} = request
		const newJob = await this.prisma.userVacancy.create({
			data: {
				accountId: request.accountId,
				vacancy: {
					create: {
						title,
						company,
						description,
						salary,
						position,
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

	// public async getJobs(
	// 	request: GetJobsRequest
	// ): Promise<JobPaginationResponse> {
	// 	const page = request.chunk?.page ?? 1
	// 	const limit = request.chunk?.limit ?? 10
	// 	const paginate = createPaginator({ page, limit })

	// 	const chunk = await paginate<Job, VacancyFindManyArgs>(
	// 		this.prisma.vacancy,
	// 		{
	// 			where: {
	// 				userVacancies: {
	// 					some: { accountId: request.accountId }
	// 				}
	// 			},
	// 			orderBy: { createdAt: 'desc' },
	// 			select: this.vacancySelection
	// 		},
	// 		{ page, limit }
	// 	)
	// 	return chunk as JobPaginationResponse
	// }

	public async getJobs(
		request: GetJobsRequest
	): Promise<JobPaginationResponse> {
		const page = request.chunk?.page ?? 1
		const limit = request.chunk?.limit ?? 10
		const paginate = createPaginator({ page, limit })

		// 1. Initialize the base "where" with the accountId constraint
		const where: VacancyWhereInput = {
			userVacancies: {
				some: { accountId: request.accountId }
			}
		}

		// 2. Add Positions filter only if the list is not empty
		if (request.positions && request.positions.length > 0) {
			where.position = { in: request.positions }
		}

		// 3. Add Locations filter only if the list is not empty
		if (request.locations && request.locations.length > 0) {
			where.location = { in: request.locations }
		}

		// 4. Add Services filter (mapping service names to sourceUrl partial matches)
		if (request.services && request.services.length > 0) {
			where.OR = request.services.map(service => ({
				sourceUrl: { contains: service }
			}))
		}

		// if (
		// 	request.salaryFrom !== undefined ||
		// 	request.salaryTo !== undefined
		// ) {
		// 	const salaryConditions: any[] = []

		// 	if (request.salaryFrom !== undefined) {
		// 		salaryConditions.push({
		// 			salaryValueFrom: { gte: request.salaryFrom }
		// 		})
		// 	}

		// 	if (request.salaryTo !== undefined) {
		// 		salaryConditions.push({
		// 			salaryValueTo: { lte: request.salaryTo }
		// 		})
		// 	}

		// 	if (salaryConditions.length > 0) {
		// 		where.AND = salaryConditions
		// 	}
		// }

		if (
			request.salaryFrom !== undefined ||
			request.salaryTo !== undefined
		) {
			const salaryConditions: VacancyWhereInput[] = []

			if (request.salaryFrom !== undefined) {
				salaryConditions.push({
					salaryValueFrom: { gte: request.salaryFrom }
				})
			}

			if (request.salaryTo !== undefined) {
				salaryConditions.push({
					salaryValueTo: { lte: request.salaryTo }
				})
			}

			if (salaryConditions.length > 0) {
				where.AND = [
					...(Array.isArray(where.AND) ? where.AND : []),
					{
						OR: [
							{ AND: salaryConditions },
							{
								AND: [
									{ salaryValueFrom: null },
									{ salaryValueTo: null }
								]
							}
						]
					}
				]
			}
		}

		const chunk = await paginate<Job, VacancyFindManyArgs>(
			this.prisma.vacancy,
			{
				where,
				orderBy: { createdAt: 'desc' },
				select: this.vacancySelection
			},
			{ page, limit }
		)

		return chunk as JobPaginationResponse
	}

	public async generateFilterForUser(
		accountId: string
	): Promise<GetJobFilterResponse> {
		const aggregations = await this.prisma.vacancy.groupBy({
			by: ['position', 'location'],
			where: {
				userVacancies: { some: { accountId } }
			}
		})

		const vacancies = await this.prisma.vacancy.findMany({
			where: { userVacancies: { some: { accountId } } },
			select: { sourceUrl: true },
			distinct: ['sourceUrl']
		})

		const salaryBounds = await this.prisma.vacancy.aggregate({
			where: { userVacancies: { some: { accountId } } },
			_min: { salaryValueFrom: true },
			_max: { salaryValueTo: true }
		})

		const positions = [
			...new Set(aggregations.map(a => a.position))
		].filter(Boolean) as string[]
		const locations = [
			...new Set(aggregations.map(a => a.location))
		].filter(Boolean) as string[]

		const services = [
			...new Set(
				vacancies.map(v => {
					const url = v.sourceUrl.toLowerCase()
					if (url.includes('work.ua')) return 'work.ua'
					return 'other'
				})
			)
		]

		return {
			positions,
			locations,
			services,
			salaryFrom: salaryBounds._min.salaryValueFrom ?? 0,
			salaryTo: salaryBounds._max.salaryValueTo ?? 0
		}
	}
}
