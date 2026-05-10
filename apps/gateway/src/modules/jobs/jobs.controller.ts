import { GetMeRequest } from '@jrai/contracts/gen/account'
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
import {
	JobFilterDtoResponse,
	JobPaginationResponse,
	JobResponse
} from './responses/job.response'

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
		@Query('limit') limit: number = 50,
		@Query('positions') positions?: string[],
		@Query('locations') locations?: string[],
		@Query('services') services?: string[],
		@Query('salaryFrom') salaryFrom?: number,
		@Query('salaryTo') salaryTo?: number
	) {
		return await this.jobClient.call('getJobs', {
			accountId,
			chunk: { page, limit },
			locations: locations
				? Array.isArray(locations)
					? locations
					: [locations]
				: [],
			positions: positions
				? Array.isArray(positions)
					? positions
					: [positions]
				: [],
			services: services
				? Array.isArray(services)
					? services
					: [services]
				: [],
			salaryFrom: salaryFrom ? Number(salaryFrom) : undefined,
			salaryTo: salaryTo ? Number(salaryTo) : undefined
		} as GetJobsRequest)
	}

	@ApiOperation({
		summary: 'Filters',
		description: 'Provides jobs filter'
	})
	@ApiOkResponse({
		description: 'Returns jobs filter',
		type: JobFilterDtoResponse
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiInternalServerErrorResponse({
		description: 'Failed to get jobs filter'
	})
	@ApiBearerAuth()
	@Protected()
	@Get('filters')
	@HttpCode(HttpStatus.OK)
	public async getJobsFilter(@CurrentUser('id') accountId: string) {
		return await this.jobClient.call('getFilters', {
			id: accountId
		} as GetMeRequest)
	}
}
