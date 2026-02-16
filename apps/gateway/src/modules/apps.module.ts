import { Module } from '@nestjs/common'

import { AccountModule } from './accounts/account.module'
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [AuthModule, AccountModule]
})
export class AppsModule {}
