import { Module } from '@nestjs/common'

import { AccountModule } from './accounts/account.module'
import { AiModule } from './ai/ai.module'
import { AuthModule } from './auth/auth.module'
import { JobsModule } from './jobs/jobs.module'
import { ResumeModule } from './resume/resume.module'
import { BillingModule } from './billing/billing.module';

@Module({
	imports: [AuthModule, AccountModule, ResumeModule, AiModule, JobsModule, BillingModule]
})
export class AppsModule {}
