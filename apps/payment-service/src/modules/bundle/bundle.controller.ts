import { PAYMENT_SERVICE_NAME } from '@jrai/contracts/gen/payment'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { BundleService } from './bundle.service'

@Controller()
export class BundleController {
	public constructor(private readonly bundleService: BundleService) {}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'GetBundles')
	public async getBundles() {
		const bundles = await this.bundleService.findAll()
		return { bundles }
	}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'BuyBundle')
	buyBundle(data: { accountId: string; email: string; bundleId: string }) {
		return this.bundleService.buyBundle(data)
	}
}
