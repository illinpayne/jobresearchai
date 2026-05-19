import type { CreateVacancyEventType } from '@jrai/contracts'
import { type GetMeRequest } from '@jrai/contracts/gen/account'
import {
	type GetJobByIdRequest,
	GetJobFilterResponse,
	type GetJobsRequest,
	Job,
	JOB_SERVICE_NAME,
	JobPaginationResponse
} from '@jrai/contracts/gen/job'
import { Controller, Inject } from '@nestjs/common'
import {
	Ctx,
	EventPattern,
	GrpcMethod,
	Payload,
	RmqContext
} from '@nestjs/microservices'

import { ScrapperStrategy } from '@/common/abstracts/scrapper-strategy.abstract'
import { RmqService } from '@/infrastructure/rmq/rmq.service'

import { WORKUA_STRATEGY_TOKEN } from '../scrapper/strategies/workua-scrapper.strategy'

import { JobsService } from './jobs.service'

@Controller()
export class JobsController {
	public constructor(
		private readonly jobsService: JobsService,
		private readonly rmqService: RmqService,
		@Inject(WORKUA_STRATEGY_TOKEN)
		private readonly workUaScrapper: ScrapperStrategy
	) {}

	@EventPattern('job.create')
	public async BulkJobsToUser(
		@Payload() data: CreateVacancyEventType,
		@Ctx() ctx: RmqContext
	) {
		try {
			const scrappedJobs = await this.workUaScrapper.scrape({
				...data,
				tags: [data.tags[0]],
				limit: data.limit
			})
			console.log(scrappedJobs.length)
			await this.jobsService.bulkNewJobToUser(
				data.accountId,
				scrappedJobs
			)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}

	@GrpcMethod(JOB_SERVICE_NAME, 'GetJobById')
	public async getJobById(request: GetJobByIdRequest): Promise<Job> {
		return await this.jobsService.getJobById(request)
	}

	@GrpcMethod(JOB_SERVICE_NAME, 'GetJobs')
	public async getJobs(
		request: GetJobsRequest
	): Promise<JobPaginationResponse> {
		return await this.jobsService.getJobs(request)
	}

	@GrpcMethod(JOB_SERVICE_NAME, 'GetFilters')
	public async getFilter(
		request: GetMeRequest
	): Promise<GetJobFilterResponse> {
		return await this.jobsService.generateFilterForUser(request.id)
	}
}
