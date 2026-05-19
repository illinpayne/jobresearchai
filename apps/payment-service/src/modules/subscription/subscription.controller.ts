import type {
	AccountRequest,
	CheckoutResponse,
	SubscribeRequest
} from '@jrai/contracts/gen/payment'
import { PAYMENT_SERVICE_NAME } from '@jrai/contracts/gen/payment'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { SubscriptionService } from './subscription.service'

@Controller()
export class SubscriptionController {
	public constructor(
		private readonly subscriptionService: SubscriptionService
	) {}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'Subscribe')
	public async subscribe(data: SubscribeRequest): Promise<CheckoutResponse> {
		return await this.subscriptionService.subscribe({
			accountId: data.accountId,
			email: data.email,
			planId: data.planId,
			interval: data.interval as any
		})
	}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'GetSubscription')
	public async getSubscription(data: AccountRequest) {
		return await this.subscriptionService.findSubscription(data.accountId)
	}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'CancelSubscription')
	public async cancelSubscription(data: AccountRequest) {
		return await this.subscriptionService.cancel(data.accountId)
	}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'ResumeSubscription')
	public async resumeSubscription(data: AccountRequest) {
		return await this.subscriptionService.resume(data.accountId)
	}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'RetryFailedPayment')
	public async retryFailedPayment(data: AccountRequest) {
		return await this.subscriptionService.retryFailedPayment(data.accountId)
	}
}
