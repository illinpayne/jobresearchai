import { IsNotEmpty, IsString } from 'class-validator'

export class StripeValidator {
	@IsString()
	@IsNotEmpty()
	public PAYMENT_STRIPE_SECRET_KEY: string

	@IsString()
	@IsNotEmpty()
	public PAYMENT_STRIPE_WEBHOOK_SECRET: string
}
