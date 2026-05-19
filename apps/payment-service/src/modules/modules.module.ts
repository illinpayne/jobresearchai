import { Module } from '@nestjs/common'

import { AccountBillModule } from './account-bill/account-bill.module'
import { BillingModule } from './billing/billing.module'
import { BundleModule } from './bundle/bundle.module'
import { PlanModule } from './plan/plan.module'
import { SubscriptionModule } from './subscription/subscription.module'
import { TransactionModule } from './transaction/transaction.module'

@Module({
	imports: [
		AccountBillModule,
		PlanModule,
		BundleModule,
		SubscriptionModule,
		TransactionModule,
		BillingModule
	]
})
export class ModulesModule {}
