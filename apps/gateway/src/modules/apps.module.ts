import { Module } from '@nestjs/common'

import { AccountModule } from './accounts/account.module'
import { AuthModule } from './auth/auth.module'
import { ResumeModule } from './resume/resume.module';

@Module({
	imports: [AuthModule, AccountModule, ResumeModule]
})
export class AppsModule {}
