import type { OtpRequestEvent } from '@jrai/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { RmqService } from '@/infrastructure/rmq/rmq.service'

import { AuthNotificationsService } from './auth-notifications.service'

@Controller()
export class AuthNotificationsController {
	public constructor(
		private readonly authNotificationsService: AuthNotificationsService,
		private readonly rmqService: RmqService
	) {}

	@EventPattern('auth.otp.register')
	public async Register(
		@Payload() data: OtpRequestEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.authNotificationsService.sendRegisterOtp(data)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}

	@EventPattern('auth.otp.forgotpassword')
	public async ForgotPassword(
		@Payload() data: OtpRequestEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.authNotificationsService.sendForgotPasswordOtp(data)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}

	@EventPattern('auth.otp.changeemail')
	public async ChangeEmail(
		@Payload() data: OtpRequestEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.authNotificationsService.sendChangeEmailOtp(data)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.rmqService.nack(ctx)
		}
	}
}
