import { Module } from '@nestjs/common'

import { PaymentProviderModule } from '@/infrastructure/payment-providers/payment-provider.module'

import { AccountBillService } from '../account-bill/account-bill.service'

import { BillingController } from './billing.controller'
import { BillingService } from './billing.service'

@Module({
	imports: [PaymentProviderModule],
	controllers: [BillingController],
	providers: [BillingService, AccountBillService]
})
export class BillingModule {}
