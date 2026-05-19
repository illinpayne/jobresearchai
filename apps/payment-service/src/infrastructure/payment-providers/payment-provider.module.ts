import { Module } from '@nestjs/common'

import { PaymentProvider } from '@/common/abstracts/payment-provider.abstract'

import { StripePaymentProvider } from './provider/stripe-payment.provider'

@Module({
	providers: [
		{
			provide: PaymentProvider,
			useClass: StripePaymentProvider
		}
	],
	exports: [PaymentProvider]
})
export class PaymentProviderModule {}
