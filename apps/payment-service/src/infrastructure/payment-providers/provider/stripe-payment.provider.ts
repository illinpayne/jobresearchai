import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

import { PaymentProvider } from '@/common/abstracts/payment-provider.abstract'
import { AllConfigs, AppConfig } from '@/config/interfaces'

@Injectable()
export class StripePaymentProvider
	extends PaymentProvider
	implements OnModuleInit
{
	private _stripe: Stripe
	private successUrl: string
	private cancelUrl: string

	public constructor(private readonly config: ConfigService<AllConfigs>) {
		super()
		const { app_url } = config.get('app', { infer: true }) as AppConfig

		this.successUrl = `${app_url}/billing/success`
		this.cancelUrl = `${app_url}/billing/cancel`
	}

	onModuleInit() {
		this._stripe = new Stripe(
			this.config.get('stripe.secretKey', { infer: true }) as string,
			{
				apiVersion: '2026-02-25.clover',
				typescript: true
			}
		)
	}

	public get stripe(): Stripe {
		return this._stripe
	}

	public async createSubscriptionSession(params: {
		customerEmail: string
		priceId: string
		accountId: string
		planId: string
		interval: string
		trialDays: number
	}): Promise<Stripe.Checkout.Session> {
		return this._stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_collection: 'always',
			customer_email: params.customerEmail,
			line_items: [{ price: params.priceId, quantity: 1 }],
			success_url: this.successUrl,
			cancel_url: this.cancelUrl,
			metadata: {
				accountId: params.accountId,
				planId: params.planId,
				interval: params.interval,
				type: 'subscription'
			},
			subscription_data: {
				...(params.trialDays > 0 && {
					trial_period_days: params.trialDays
				}),
				metadata: {
					accountId: params.accountId,
					planId: params.planId
				}
			}
		})
	}

	public async createPaymentSession(params: {
		customerEmail: string
		priceId: string
		accountId: string
		bundleId: string
	}): Promise<Stripe.Checkout.Session> {
		return this._stripe.checkout.sessions.create({
			mode: 'payment',
			payment_intent_data: {
				description: `Bundle Purchase`
			},
			customer_email: params.customerEmail,
			line_items: [{ price: params.priceId, quantity: 1 }],
			success_url: this.successUrl,
			cancel_url: this.cancelUrl,
			metadata: {
				accountId: params.accountId,
				bundleId: params.bundleId,
				type: 'bundle'
			}
		})
	}

	public constructWebhookEvent(
		payload: Buffer,
		signature: string
	): Stripe.Event {
		const webhookSecret = this.config.get('stripe.webhookSecret', {
			infer: true
		}) as string
		return this._stripe.webhooks.constructEvent(
			payload,
			signature,
			webhookSecret
		)
	}

	public async cancelSubscription(
		stripeSubscriptionId: string
	): Promise<Stripe.Subscription> {
		return await this._stripe.subscriptions.update(stripeSubscriptionId, {
			cancel_at_period_end: true
		})
	}

	public async resumeSubscription(
		stripeSubscriptionId: string
	): Promise<Stripe.Subscription> {
		return await this._stripe.subscriptions.update(stripeSubscriptionId, {
			cancel_at_period_end: false
		})
	}

	public async createBillingPortalSession(
		customerId: string
	): Promise<string> {
		const app_url = this.config.get('app.app_url', {
			infer: true
		}) as string
		const session = await this._stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: app_url
		})
		return session.url
	}

	public async retryInvoice(invoiceId: string): Promise<Stripe.Invoice> {
		return this._stripe.invoices.pay(invoiceId)
	}
}
