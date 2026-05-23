import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { CurrentUser, Protected } from '@/common/decorators'
import type { JwtPayload } from '@/shared/jwt.types'

import { BillingClientGrpc } from './billing.grpc'
import { BillingService } from './billing.service'
import { BuyBundleDto } from './dto/buybundle.dto'
import { CreateSubscriptionDto } from './dto/subscribe.dto'
import { BundlesResponse } from './responses/bundle.response'
import { PaymentLinkResponse } from './responses/payment-link.response'
import { PlansResponse } from './responses/plan.response'
import { SubscriptionModelResponse } from './responses/subscription.response'

@Controller('billing')
export class BillingController {
	public constructor(
		private readonly billingService: BillingService,
		private readonly billingClient: BillingClientGrpc
	) {}

	@ApiOperation({
		summary: 'Billing plans',
		description: 'Provides all available plans to buy'
	})
	@ApiOkResponse({
		description: 'Returns list of plans',
		type: PlansResponse
	})
	@Get('plans')
	@HttpCode(HttpStatus.OK)
	public async getPlans() {
		return await this.billingClient.call('getPlans', {})
	}

	@ApiOperation({
		summary: 'Billing bundles with extra credits',
		description:
			'Provides all available bundles to buy for getting extra credits to balance'
	})
	@ApiOkResponse({
		description: 'Returns list of bundles',
		type: BundlesResponse
	})
	@Get('bundles')
	@HttpCode(HttpStatus.OK)
	public async getBundles() {
		return await this.billingClient.call('getBundles', {})
	}

	@ApiOperation({
		summary: 'Provides current subscription',
		description:
			'Provides current subscription of the customer account billing'
	})
	@ApiOkResponse({
		description: 'Returns subscription',
		type: SubscriptionModelResponse
	})
	@Get('subscription')
	@ApiBearerAuth()
	@Protected()
	@HttpCode(HttpStatus.OK)
	public async getSubscription(@CurrentUser('id') id: string) {
		return await this.billingClient.call('getSubscription', {
			accountId: id
		})
	}

	@ApiOperation({
		summary: 'Provides url for payment to subscribe the plan',
		description: 'Provides url for payment to subscribe the plan'
	})
	@ApiOkResponse({
		description: 'Returns url of payment',
		type: PaymentLinkResponse
	})
	@Post('subscribe')
	@ApiBearerAuth()
	@Protected()
	@HttpCode(HttpStatus.OK)
	public async makePaymentSubscription(
		@CurrentUser() account: JwtPayload,
		@Body() dto: CreateSubscriptionDto
	) {
		return await this.billingClient.call('subscribe', {
			accountId: account.id,
			email: account.email,
			planId: dto.planId,
			interval: dto.interval
		})
	}

	@ApiOperation({
		summary: 'Provides url for payment to buy a bundle',
		description: 'Provides url for payment to buy a bundle'
	})
	@ApiOkResponse({
		description: 'Returns url of payment',
		type: PaymentLinkResponse
	})
	@Post('buy-bundle')
	@ApiBearerAuth()
	@Protected()
	@HttpCode(HttpStatus.OK)
	public async makeOnetimePaymentSubscription(
		@CurrentUser() account: JwtPayload,
		@Body() dto: BuyBundleDto
	) {
		return await this.billingClient.call('buyBundle', {
			accountId: account.id,
			email: account.email,
			bundleId: dto.bundleId
		})
	}
}
