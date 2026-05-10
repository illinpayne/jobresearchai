import { Module } from '@nestjs/common'
import { JobsModule } from './jobs/jobs.module';
import { ScrapperModule } from './scrapper/scrapper.module';

@Module({
  imports: [JobsModule, ScrapperModule]
})
export class ModulesModule {}
