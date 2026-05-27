import { registerAs } from '@nestjs/config'

import { StripeConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { StripeValidator } from '../validators'

export const stripeEnv = registerAs<StripeConfig>('stripe', () => {
	validateEnv(process.env, StripeValidator)

	return {
		secretKey: process.env.PAYMENT_STRIPE_SECRET_KEY as string,
		webhookSecret: process.env.PAYMENT_STRIPE_WEBHOOK_SECRET as string
	} as StripeConfig
})
