import { Module } from '@nestjs/common'

import { PaymentProviderModule } from '@/infrastructure/payment-providers/payment-provider.module'

import { BundleController } from './bundle.controller'
import { BundleService } from './bundle.service'

@Module({
	imports: [PaymentProviderModule],
	controllers: [BundleController],
	providers: [BundleService],
	exports: [BundleService]
})
export class BundleModule {}
