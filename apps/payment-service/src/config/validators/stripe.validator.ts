import { IsNotEmpty, IsString } from 'class-validator'

export class StripeValidator {
	@IsString()
	@IsNotEmpty()
	public STRIPE_SECRET_KEY: string

	@IsString()
	@IsNotEmpty()
	public STRIPE_WEBHOOK_SECRET: string
}
