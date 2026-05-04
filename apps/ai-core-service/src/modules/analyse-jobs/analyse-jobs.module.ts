import { Module } from '@nestjs/common'

import { AnalyseJobRepository } from './analyse-job.repository'
import { AnalyseJobsController } from './analyse-jobs.controller'
import { AnalyseJobsService } from './analyse-jobs.service'

@Module({
	controllers: [AnalyseJobsController],
	providers: [AnalyseJobsService, AnalyseJobRepository]
})
export class AnalyseJobsModule {}
