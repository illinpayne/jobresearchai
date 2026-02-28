import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Queue } from 'bullmq'
import { Resend as Transporter } from 'resend'

import {
	ExtendedMailService,
	MailService
} from '@/common/abstractions/mail.service.abstract'
import { AllConfigs } from '@/config/interfaces'

import { MailProps } from '../types/mail.types'

@Injectable()
export class ResendService implements MailService, ExtendedMailService {
	private readonly transporter: Transporter
	public constructor(
		private readonly configService: ConfigService<AllConfigs>,
		@InjectQueue('mail') private readonly queue: Queue
	) {
		this.transporter = new Transporter(
			this.configService.get('smtp.resend_api_token', { infer: true })
		)
	}

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
		return this.transporter.emails.send({
			from: `JobResearcher AI <${this.configService.get('smtp.from_address', { infer: true })}>`,
			to: email,
			subject,
			html
		})
	}
}
