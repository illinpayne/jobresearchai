import { MailerService as Transporter } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

import {
	ExtendedMailService,
	MailService
} from '@/common/abstractions/mail.service.abstract'

import { MailProps } from '../types/mail.types'

// This service is currently not used, but it can be used in the future if we want to switch to a different mailer that is compatible with @nestjs-modules/mailer
@Injectable()
export class MailerService implements MailService, ExtendedMailService {
	public constructor(
		private readonly transporter: Transporter,
		@InjectQueue('mail') private readonly queue: Queue
	) {}

	public async addMailToQueue(request: MailProps): Promise<boolean> {
		const { email, html, subject } = request

		await this.queue.add(
			'send-email',
			{ email: email, subject, html },
			{ removeOnComplete: true }
		)
		return true
	}

	public async send(email: string, subject: string, html: string) {
		return this.transporter.sendMail({
			to: email,
			subject,
			html
		})
	}
}
