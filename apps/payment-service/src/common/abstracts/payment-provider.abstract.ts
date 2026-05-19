import Stripe from 'stripe'

export abstract class PaymentProvider {
	public abstract readonly stripe: Stripe

	public abstract createSubscriptionSession(params: {
		customerEmail: string
		priceId: string
		accountId: string
		planId: string
		interval: string
		trialDays: number
	}): Promise<Stripe.Checkout.Session>

	public abstract createPaymentSession(params: {
		customerEmail: string
		priceId: string
		accountId: string
		bundleId: string
	}): Promise<Stripe.Checkout.Session>

	public abstract constructWebhookEvent(
		payload: Buffer,
		signature: string
	): Stripe.Event

	abstract cancelSubscription(
		stripeSubscriptionId: string
	): Promise<Stripe.Subscription>
	abstract resumeSubscription(
		stripeSubscriptionId: string
	): Promise<Stripe.Subscription>

	abstract createBillingPortalSession(customerId: string): Promise<string>
	abstract retryInvoice(invoiceId: string): Promise<Stripe.Invoice>
}
