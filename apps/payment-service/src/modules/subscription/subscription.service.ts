import { CheckoutResponse } from '@jrai/contracts/gen/payment'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'
import { BillingInterval, SubscriptionStatus } from '@prisma/generated/enums'
import Stripe from 'stripe'

import { PaymentProvider } from '@/common/abstracts/payment-provider.abstract'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'

import { AccountBillService } from '../account-bill/account-bill.service'
import { PlanService } from '../plan/plan.service'

import { SubscribeDto } from './dtos/subscribe.dto'

@Injectable()
export class SubscriptionService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly paymentProvider: PaymentProvider,
		private readonly planService: PlanService,
		private readonly accountBillService: AccountBillService
	) {}

	public async findSubscription(accountId: string) {
		const subscription = await this.prisma.subscription.findFirst({
			where: {
				accountId,
				status: {
					in: [
						SubscriptionStatus.ACTIVE,
						SubscriptionStatus.TRIALING,
						SubscriptionStatus.EXPIRED,
						SubscriptionStatus.PAST_DUE
					]
				}
			},
			include: { plan: true }
		})
		if (!subscription) {
			throw new GrpcException(
				RpcStatus.NOT_FOUND,
				'No subscription yet on your account'
			)
		}

		return subscription
	}

	public async findByStripeId(stripeSubscriptionId: string) {
		return await this.prisma.subscription.findFirst({
			where: { stripeSubscriptionId },
			include: { plan: true }
		})
	}

	public async upsert(data: {
		accountId: string
		planId: string
		stripeSubscriptionId: string
		stripeCustomerId: string
		status: SubscriptionStatus
		interval: BillingInterval
		currentPeriodStart: Date
		currentPeriodEnd: Date
		cancelAtPeriodEnd: boolean
	}) {
		return await this.prisma.subscription.upsert({
			where: { stripeSubscriptionId: data.stripeSubscriptionId },
			create: data,
			update: {
				status: data.status,
				currentPeriodStart: data.currentPeriodStart,
				currentPeriodEnd: data.currentPeriodEnd,
				cancelAtPeriodEnd: data.cancelAtPeriodEnd
			}
		})
	}

	public async updateStatus(id: string, status: SubscriptionStatus) {
		return await this.prisma.subscription.update({
			where: { id },
			data: { status }
		})
	}

	public async updateByStripeId(
		stripeSubscriptionId: string,
		data: Partial<{
			status: SubscriptionStatus
			cancelAtPeriodEnd: boolean
			currentPeriodStart: Date
			currentPeriodEnd: Date
		}>
	) {
		return await this.prisma.subscription.updateMany({
			where: { stripeSubscriptionId },
			data
		})
	}

	public async subscribe(dto: SubscribeDto): Promise<CheckoutResponse> {
		const accountBill = await this.accountBillService.create({
			accountId: dto.accountId,
			email: dto.email
		})

		const subscription = await this.prisma.subscription.findFirst({
			where: {
				accountId: dto.accountId,
				status: SubscriptionStatus.ACTIVE
			}
		})

		if (subscription) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Subsciption already applied, cancel first'
			)
		}

		const plan = await this.planService.findOne(dto.planId)
		if (!plan)
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Plan not found')

		const priceId =
			dto.interval === BillingInterval.MONTHLY
				? plan.stripePriceMonthlyId
				: plan.stripePriceAnnualId

		const session = await this.paymentProvider.createSubscriptionSession({
			customerEmail: accountBill.email,
			priceId,
			accountId: dto.accountId,
			planId: dto.planId,
			interval: dto.interval,
			trialDays: plan.trialDays
		})

		return { url: session.url! }
	}

	public async cancel(accountId: string) {
		const subscription = await this.findSubscription(accountId)
		if (!subscription)
			throw new GrpcException(
				RpcStatus.NOT_FOUND,
				'No active subscription found'
			)
		if (subscription.cancelAtPeriodEnd) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Subscription is already scheduled for cancellation'
			)
		}

		await this.paymentProvider.cancelSubscription(
			subscription.stripeSubscriptionId!
		)

		return await this.prisma.subscription.update({
			where: { id: subscription.id },
			data: { cancelAtPeriodEnd: true },
			include: { plan: true }
		})
	}

	public async resume(accountId: string) {
		const subscription = await this.prisma.subscription.findFirst({
			where: {
				accountId
			}
		})

		if (!subscription)
			throw new GrpcException(
				RpcStatus.NOT_FOUND,
				'No active subscription found'
			)
		if (!subscription.cancelAtPeriodEnd) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Subscription is not scheduled for cancellation'
			)
		}

		await this.paymentProvider.resumeSubscription(
			subscription.stripeSubscriptionId!
		)

		return await this.prisma.subscription.update({
			where: { id: subscription.id },
			data: { cancelAtPeriodEnd: false },
			include: { plan: true }
		})
	}

	public async retryFailedPayment(
		accountId: string
	): Promise<{ status: string }> {
		const subscription = await this.prisma.subscription.findFirst({
			where: { accountId, status: SubscriptionStatus.PAST_DUE }
		})

		if (!subscription)
			throw new GrpcException(
				RpcStatus.NOT_FOUND,
				'No past due subscription found'
			)

		const invoices = await this.paymentProvider.stripe.invoices.list({
			subscription: subscription.stripeSubscriptionId!,
			status: 'open',
			limit: 1
		})

		if (!invoices.data.length)
			throw new GrpcException(
				RpcStatus.NOT_FOUND,
				'No open invoice found'
			)

		const invoice = await this.paymentProvider.retryInvoice(
			invoices.data[0].id
		)

		return { status: invoice.status ?? 'unknown' }
	}

	private mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
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
