import { Module } from '@nestjs/common'
import { PresetsModule } from './presets/presets.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AnalyseJobsModule } from './analyse-jobs/analyse-jobs.module';

@Module({
  imports: [PresetsModule, ProfilesModule, AnalyseJobsModule]
})
export class ModulesModule {}
