import { GetMeRequest } from '@jrai/contracts/gen/account'
import {
	AiAnalyseJob,
	AiAnalyseJobSimplified,
	AnalyseJobInProgressResponse,
	CreateAnalyseJobRequest,
	GetAnalyseJobRequest,
	AnalyseStatus as ProtoStatus,
	SimplifiedAnalysedJobWithPreset,
	UpdateAnalyseJobRequest
} from '@jrai/contracts/gen/aicore'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import { AnalyseStatus as PrismaStatus } from '@prisma/generated/enums'

import { statusMapper, statusMapperExchange } from '@/lib/mapper'

import { AnalyseJobRepository } from './analyse-job.repository'

@Injectable()
export class AnalyseJobsService {
	public constructor(private readonly repository: AnalyseJobRepository) {}

	public async createNewJob(
		request: CreateAnalyseJobRequest
	): Promise<AiAnalyseJobSimplified> {
		const mappedStatus = statusMapper[request.status]
		const newJob = await this.repository.newJob(
			{
				id: request.id,
				accountId: request.accountId,
				status: mappedStatus,
				preset: {
					connect: {
						id: request.presetId
					}
				}
			},
			this.repository.simplifiedJob
		)

		if (!newJob) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				`Cannot create a new job`
			)
		}

		const { id, accountId } = newJob
		return {
			id,
			accountId,
			status: request.status
		} as AiAnalyseJobSimplified
	}

	public async updateJob(
		request: UpdateAnalyseJobRequest
	): Promise<AiAnalyseJobSimplified> {
		let mappedStatus: PrismaStatus | undefined = undefined

		if (request.status !== undefined && request.status !== null) {
			if (typeof request.status === 'number') {
				mappedStatus = statusMapper[request.status as ProtoStatus]
			} else if (typeof request.status === 'string') {
				mappedStatus = request.status as PrismaStatus
			}
		}

		const updatedJob = await this.repository.updateJob(
			request.id,
			request.accountId,
			{
				id: request.id,
				accountId: request.accountId,
				completionTokens: request.completionTokens,
				totalTokens: request.totalTokens,
				promptTokens: request.promptTokens,
				spentCredits: request.spentCredits,
				status: mappedStatus
			},
			this.repository.simplifiedJob
		)

		if (!updatedJob) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				`Cannot create a new job`
			)
		}

		const { id, accountId } = updatedJob
		return {
			id,
			accountId,
			status: request.status
		} as AiAnalyseJobSimplified
	}

	public async getFullJob(
		request: GetAnalyseJobRequest
	): Promise<AiAnalyseJob> {
		const findJob = await this.repository.getJob(
			request.id,
			request.accountId,
			this.repository.normalAnalyseJob
		)

		if (!findJob) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Job not found')
		}

		const mappedStatus = statusMapperExchange[findJob.status]

		return {
			id: findJob.id,
			accountId: findJob.accountId,
			totalTokens: findJob.totalTokens,
			completionTokens: findJob.completionTokens,
			promptTokens: findJob.promptTokens,
			status: mappedStatus,
			spentCredits: findJob.spentCredits,
			preset: {
				id: findJob.preset.id,
				name: findJob.preset.name
			}
		} as AiAnalyseJob
	}

	public async getSimpleJob(
		request: GetAnalyseJobRequest
	): Promise<AiAnalyseJobSimplified> {
		const findJob = await this.repository.getJob(
			request.id,
			request.accountId,
			this.repository.simplifiedJob
		)

		if (!findJob) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Job not found')
		}

		const mappedStatus = statusMapperExchange[findJob.status]

		return {
			id: findJob.id,
			accountId: findJob.accountId,
			status: mappedStatus
		} as AiAnalyseJobSimplified
	}

	public async getAccountJobsInProgress(
		request: GetMeRequest
	): Promise<AnalyseJobInProgressResponse> {
		const jobsInProgress = await this.repository.getJobs(
			{
				accountId: request.id,
				status: {
					in: ['WAITING', 'INQUEUE']
				}
			},
			this.repository.jobInProgress
		)

		if (!jobsInProgress || jobsInProgress.length === 0) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Jobs not found')
		}

		return {
			jobs: jobsInProgress.map(j => {
				return {
					id: j.id,
					status: j.status,
					presetName: j.preset.name
				} as SimplifiedAnalysedJobWithPreset
			})
		}
	}
}
