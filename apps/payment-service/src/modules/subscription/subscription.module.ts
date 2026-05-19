import { Module } from '@nestjs/common'

import { PaymentProviderModule } from '@/infrastructure/payment-providers/payment-provider.module'

import { AccountBillService } from '../account-bill/account-bill.service'
import { PlanService } from '../plan/plan.service'

import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'

@Module({
	imports: [PaymentProviderModule],
	providers: [SubscriptionService, PlanService, AccountBillService],
	controllers: [SubscriptionController],
	exports: [SubscriptionService]
})
export class SubscriptionModule {}
