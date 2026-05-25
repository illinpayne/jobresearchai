import { Module } from '@nestjs/common'

import { AccountBillController } from './account-bill.controller'
import { AccountBillService } from './account-bill.service'

@Module({
	controllers: [AccountBillController],
	providers: [AccountBillService]
})
export class AccountBillModule {}
