import { GetJobByIdRequest, GetJobsRequest } from '@jrai/contracts/gen/job'
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '@/common/decorators'

import { JobClientGrpc } from './job.grpc'
import { JobPaginationResponse, JobResponse } from './responses/job.response'

@Controller('jobs')
export class JobsController {
	public constructor(private readonly jobClient: JobClientGrpc) {}

	@ApiOperation({
		summary: 'Job',
		description: 'Provides job information'
	})
	@ApiOkResponse({
		description: 'Returns job information',
		type: JobResponse
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiInternalServerErrorResponse({
		description: 'Failed to get job data'
	})
	@ApiBearerAuth()
	@Protected()
	@Get()
	@HttpCode(HttpStatus.OK)
	public async getJobById(@Query('id') id: string) {
		return await this.jobClient.call('getJobById', {
			id
		} as GetJobByIdRequest)
	}

	@ApiOperation({
		summary: 'Jobs',
		description: 'Provides jobs in chunk'
	})
	@ApiOkResponse({
		description: 'Returns jobs in chunks',
		type: JobPaginationResponse
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiInternalServerErrorResponse({
		description: 'Failed to get job data'
	})
	@ApiBearerAuth()
	@Protected()
	@Get('chunk')
	@HttpCode(HttpStatus.OK)
	public async getJobs(
		@CurrentUser('id') accountId: string,
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 50
	) {
		return await this.jobClient.call('getJobs', {
			accountId,
			chunk: { page, limit }
		} as GetJobsRequest)
	}
}
