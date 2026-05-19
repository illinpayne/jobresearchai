import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { BillingClientGrpc } from './billing.grpc'
import { BillingService } from './billing.service'
import { BundlesResponse } from './responses/bundle.response'
import { PlansResponse } from './responses/plan.response'

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
}
