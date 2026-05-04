import {
	AI_CORE_SERVICE_NAME,
	AiAnalyseJob,
	type AiAnalyseJobSimplified,
	type CreateAnalyseJobRequest,
	type GetAnalyseJobRequest,
	type UpdateAnalyseJobRequest
} from '@jrai/contracts/gen/aicore'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { AnalyseJobsService } from './analyse-jobs.service'

@Controller()
export class AnalyseJobsController {
	constructor(private readonly analyseJobsService: AnalyseJobsService) {}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'CreateAnalyseJob')
	public async createNewJob(
		request: CreateAnalyseJobRequest
	): Promise<AiAnalyseJobSimplified> {
		return await this.analyseJobsService.createNewJob(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'UpdateAnalyseJob')
	public async updateAnalyseJob(
		request: UpdateAnalyseJobRequest
	): Promise<AiAnalyseJobSimplified> {
		return await this.analyseJobsService.updateJob(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetFullAnalyseJob')
	public async getFullAnalyseJob(
		request: GetAnalyseJobRequest
	): Promise<AiAnalyseJob> {
		return await this.analyseJobsService.getFullJob(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetSimpleAnalyseJob')
	public async getSimpleAnalyseJob(
		request: GetAnalyseJobRequest
	): Promise<AiAnalyseJobSimplified> {
		return await this.analyseJobsService.getSimpleJob(request)
	}
}
