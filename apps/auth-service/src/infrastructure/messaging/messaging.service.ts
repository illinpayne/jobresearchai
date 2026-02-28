import type { OtpRequestEvent } from '@jrai/contracts'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { MessagingQueueName } from './messaging.types'

@Injectable()
export class MessagingService {
	public constructor(
		@Inject(MessagingQueueName) private readonly client: ClientProxy
	) {}

	public async sendRegisterOtp(data: OtpRequestEvent) {
		return this.client.emit('auth.otp.register', data)
	}

	public async sendForgotPasswordOtp(data: OtpRequestEvent) {
		return this.client.emit('auth.otp.forgotpassword', data)
	}

	public async sendChangeEmailOtp(data: OtpRequestEvent) {
		return this.client.emit('auth.otp.changeemail', data)
	}
}
