import { Module } from '@nestjs/common'

import { AccountModule } from './accounts/account.module'
import { AiModule } from './ai/ai.module'
import { AuthModule } from './auth/auth.module'
import { ResumeModule } from './resume/resume.module'

@Module({
	imports: [AuthModule, AccountModule, ResumeModule, AiModule]
})
export class AppsModule {}
