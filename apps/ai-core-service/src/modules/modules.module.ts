import { Module } from '@nestjs/common'

import { AnalyseJobsModule } from './analyse-jobs/analyse-jobs.module'
import { PresetsModule } from './presets/presets.module'
import { ProfilesModule } from './profiles/profiles.module'

@Module({
	imports: [PresetsModule, ProfilesModule, AnalyseJobsModule]
})
export class ModulesModule {}
