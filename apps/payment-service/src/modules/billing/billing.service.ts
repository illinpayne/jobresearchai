import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import {
	BillingInterval,
	SubscriptionStatus,
	TransactionStatus,
	TransactionType
} from '@prisma/generated/enums'
import Stripe from 'stripe'

import { PaymentProvider } from '@/common/abstracts/payment-provider.abstract'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'

import { AccountBillService } from '../account-bill/account-bill.service'

@Injectable()
export class BillingService {
	private readonly logger = new Logger(BillingService.name)

	public constructor(
		private readonly prisma: PrismaService,
		private readonly paymentProvider: PaymentProvider,
		private readonly accountBillService: AccountBillService
	) {}
	public async handleWebhook(
		payload: Buffer,
		signature: string
	): Promise<void> {
		let event: Stripe.Event
		try {
			event = this.paymentProvider.constructWebhookEvent(
				payload,
				signature
			)
		} catch (err: any) {
			throw new BadRequestException(
				`Webhook signature invalid: ${err.message}`
			)
		}

		this.logger.log(`Stripe event: ${event.type}`)

		switch (event.type) {
			case 'checkout.session.completed':
				await this.onCheckoutCompleted(
					event.data.object as Stripe.Checkout.Session
				)
				break

			case 'invoice.payment_succeeded':
				await this.onInvoicePaymentSucceeded(
					event.data.object as Stripe.Invoice
				)
				break
			case 'customer.subscription.trial_will_end':
				await this.onTrialWillEnd(
					event.data.object as Stripe.Subscription
				)
				break
			case 'invoice.payment_failed':
				await this.onInvoicePaymentFailed(
					event.data.object as Stripe.Invoice
				)
				break

			case 'customer.subscription.updated':
				await this.onSubscriptionUpdated(
					event.data.object as Stripe.Subscription
				)
				break

			case 'customer.subscription.deleted':
				await this.onSubscriptionDeleted(
					event.data.object as Stripe.Subscription
				)
				break
			case 'invoice.upcoming':
				await this.onInvoiceUpcoming(
					event.data.object as Stripe.Invoice
				)
				break
			default:
			// this.logger.verbose(`Ignored event: ${event.type}`)
		}
	}

	// First payment done — create subscription row or record bundle purchase, set credits
	private async onCheckoutCompleted(session: Stripe.Checkout.Session) {
		const { type, accountId, planId, bundleId, interval } =
			session.metadata ?? {}
		const email =
			session.customer_details?.email ?? 'vito.cornleone@scaute.com'

		await this.accountBillService.ensureExists(accountId, email)

		if (type === 'subscription') {
			const stripeSubscription =
				await this.paymentProvider.stripe.subscriptions.retrieve(
					session.subscription as string,
					{ expand: ['latest_invoice'] }
				)

			const subscription = await this.prisma.subscription.upsert({
				where: { stripeSubscriptionId: stripeSubscription.id },
				create: {
					accountId,
					planId,
					stripeSubscriptionId: stripeSubscription.id,
					stripeCustomerId: session.customer as string,
					status: this.mapSubscriptionStatus(
						stripeSubscription.status
					),
					interval:
						interval === 'ANNUAL'
							? BillingInterval.ANNUAL
							: BillingInterval.MONTHLY,
					currentPeriodStart: new Date(
						stripeSubscription.items.data[0].current_period_start *
							1000
					),
					currentPeriodEnd: new Date(
						stripeSubscription.items.data[0].current_period_end *
							1000
					),
					cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
				},
				update: {
					status: this.mapSubscriptionStatus(
						stripeSubscription.status
					),
					currentPeriodStart: new Date(
						stripeSubscription.items.data[0].current_period_start *
							1000
					),
					currentPeriodEnd: new Date(
						stripeSubscription.items.data[0].current_period_end *
							1000
					)
				}
			})

			const plan = await this.prisma.plan.findUnique({
				where: { id: planId }
			})
			if (plan && plan.grantedCredits > 0) {
				await this.accountBillService.setCredits(
					accountId,
					plan.grantedCredits
				)
			}

			const latestInvoice =
				stripeSubscription.latest_invoice as Stripe.Invoice

			await this.prisma.transaction.create({
				data: {
					accountId,
					type: TransactionType.SUBSCRIPTION_CREATED,
					status: TransactionStatus.SUCCEEDED,
					stripePaymentIntentId: session.payment_intent as
						| string
						| undefined,
					stripeInvoiceId: latestInvoice?.id,
					subscriptionId: subscription.id
				}
			})
		}

		if (type === 'bundle') {
			const bundle = await this.prisma.bundle.findUnique({
				where: { id: bundleId }
			})
			if (!bundle) return

			await this.prisma.transaction.create({
				data: {
					accountId,
					type: TransactionType.BUNDLE_PURCHASE,
					status: TransactionStatus.SUCCEEDED,
					stripePaymentIntentId: session.payment_intent as
						| string
						| undefined,
					bundleId: bundle.id
				}
			})

			await this.accountBillService.incrementCredits(
				accountId,
				bundle.credits
			)
		}
	}

	// Renewal payment done — update period dates, reset credits
	private async onInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
		if (!invoice.parent?.subscription_details?.subscription) return

		const stripeSubscription =
			await this.paymentProvider.stripe.subscriptions.retrieve(
				invoice.parent?.subscription_details?.subscription as string
			)

		const subscription = await this.prisma.subscription.findFirst({
			where: { stripeSubscriptionId: stripeSubscription.id },
			include: { plan: true }
		})

		if (!subscription) return

		await this.prisma.subscription.update({
			where: { id: subscription.id },
			data: {
				status: SubscriptionStatus.ACTIVE,
				currentPeriodStart: new Date(
					stripeSubscription.items.data[0].current_period_start * 1000
				),
				currentPeriodEnd: new Date(
					stripeSubscription.items.data[0].current_period_end * 1000
				)
			}
		})

		if (subscription.plan.grantedCredits > 0) {
			await this.accountBillService.setCredits(
				subscription.accountId,
				subscription.plan.grantedCredits
			)
		}

		await this.prisma.transaction.create({
			data: {
				accountId: subscription.accountId,
				type: TransactionType.SUBSCRIPTION_RENEWED,
				status: TransactionStatus.SUCCEEDED,
				stripeInvoiceId: invoice.id,
				subscriptionId: subscription.id
			}
		})
	}

	// Renewal payment failed — set status to PAST_DUE
	private async onInvoicePaymentFailed(invoice: Stripe.Invoice) {
		const stripeSubscriptionId = invoice.parent?.subscription_details
			?.subscription as string
		if (!stripeSubscriptionId) return

		await this.prisma.subscription.updateMany({
			where: { stripeSubscriptionId },
			data: { status: SubscriptionStatus.PAST_DUE }
		})

		const subscription = await this.prisma.subscription.findFirst({
			where: { stripeSubscriptionId }
		})

		if (!subscription) return

		await this.prisma.transaction.create({
			data: {
				accountId: subscription.accountId,
				type: TransactionType.SUBSCRIPTION_RENEWED,
				status: TransactionStatus.FAILED,
				stripeInvoiceId: invoice.id,
				subscriptionId: subscription.id
			}
		})
	}

	// Subscription changed (cancel scheduled, plan changed) — sync cancelAtPeriodEnd and period dates
	private async onSubscriptionUpdated(
		stripeSubscription: Stripe.Subscription
	) {
		await this.prisma.subscription.updateMany({
			where: { stripeSubscriptionId: stripeSubscription.id },
			data: {
				status: this.mapSubscriptionStatus(stripeSubscription.status),
				cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
				currentPeriodStart: new Date(
					stripeSubscription.items.data[0].current_period_start * 1000
				),
				currentPeriodEnd: new Date(
					stripeSubscription.items.data[0].current_period_end * 1000
				)
			}
		})
	}

	// Subscription fully expired — set CANCELED, reset credits to 0
	private async onSubscriptionDeleted(
		stripeSubscription: Stripe.Subscription
	) {
		const subscription = await this.prisma.subscription.findFirst({
			where: { stripeSubscriptionId: stripeSubscription.id }
		})

		if (!subscription) return

		await this.prisma.subscription.update({
			where: { id: subscription.id },
			data: { status: SubscriptionStatus.CANCELED }
		})

		await this.accountBillService.setCredits(subscription.accountId, 30)
	}

	// Notify about upcoming invoice
	private async onInvoiceUpcoming(invoice: Stripe.Invoice) {
		const subscription = await this.prisma.subscription.findFirst({
			where: {
				stripeSubscriptionId: invoice.parent?.subscription_details
					?.subscription as string
			},
			include: { plan: true }
		})

		if (!subscription) return

		console.log('emit notification')
		// Emit event to your notification module — send email/push
		// this.eventEmitter.emit('subscription.renewal.upcoming', {
		// 	accountId: subscription.accountId,
		// 	planName: subscription.plan.name,
		// 	renewalDate: subscription.currentPeriodEnd,
		// 	grantedCredits: subscription.plan.grantedCredits
		// })
	}

	// Notify about trial end
	private async onTrialWillEnd(stripeSubscription: Stripe.Subscription) {
		const subscription = await this.prisma.subscription.findFirst({
			where: { stripeSubscriptionId: stripeSubscription.id },
			include: { plan: true }
		})

		if (!subscription) return

		// Emmit to notifications
		// this.eventEmitter.emit('subscription.trial.ending', {
		// 	accountId: subscription.accountId,
		// 	planName: subscription.plan.name,
		// 	trialEndDate: new Date(stripeSubscription.trial_end! * 1000)
		// })
	}

	private mapSubscriptionStatus(
		status: Stripe.Subscription.Status
	): SubscriptionStatus {
		const map: Record<string, SubscriptionStatus> = {
			active: SubscriptionStatus.ACTIVE,
			trialing: SubscriptionStatus.TRIALING,
			past_due: SubscriptionStatus.PAST_DUE,
			canceled: SubscriptionStatus.CANCELED,
			incomplete: SubscriptionStatus.INCOMPLETE,
			incomplete_expired: SubscriptionStatus.EXPIRED,
			unpaid: SubscriptionStatus.PAST_DUE,
			paused: SubscriptionStatus.PAST_DUE
		}
		return map[status] ?? SubscriptionStatus.INCOMPLETE
	}
}
