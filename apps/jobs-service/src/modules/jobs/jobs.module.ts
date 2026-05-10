import { Module } from '@nestjs/common'

import { ScrapperModule } from '../scrapper/scrapper.module'

import { JobsController } from './jobs.controller'
import { JobsService } from './jobs.service'

@Module({
	imports: [ScrapperModule],
	controllers: [JobsController],
	providers: [JobsService]
})
export class JobsModule {}
