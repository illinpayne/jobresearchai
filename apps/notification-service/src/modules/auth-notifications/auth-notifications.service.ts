import { OtpRequestEvent } from '@jrai/contracts'
import { Injectable } from '@nestjs/common'
import { render } from '@react-email/render'
import React from 'react'

import { MailService } from '@/common/abstractions/mail.service.abstract'
import ChangeEmail from '@/emails/change-email-otp'
import ForgotPassword from '@/emails/forgot-password-otp'
import Register from '@/emails/register-otp'

@Injectable()
export class AuthNotificationsService {
	public constructor(private readonly mailService: MailService) {}

	public async sendRegisterOtp(otpRequest: OtpRequestEvent) {
		const { email, code } = otpRequest
		const html = await render(
			React.createElement(Register, { otpCode: code })
		)
		return await this.mailService.addMailToQueue({
			email,
			subject: 'Register verification',
			html: html
		})
	}

	public async sendForgotPasswordOtp(otpRequest: OtpRequestEvent) {
		const { email, code } = otpRequest
		const html = await render(
			React.createElement(ForgotPassword, { otpCode: code })
		)
		return await this.mailService.addMailToQueue({
			email,
			subject: 'Forgot your password?',
			html: html
		})
	}

	public async sendChangeEmailOtp(otpRequest: OtpRequestEvent) {
		const { email, code } = otpRequest
		const html = await render(
			React.createElement(ChangeEmail, { otpCode: code })
		)
		return await this.mailService.addMailToQueue({
			email,
			subject: 'Email verification',
			html: html
		})
	}
}
