import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { Job } from 'bullmq'

import { ExtendedMailService } from '@/common/abstractions/mail.service.abstract'

// Limitter
@Processor('mail', { limiter: { max: 2, duration: 1000 } })
@Injectable()
export class MailProcessor extends WorkerHost {
	private readonly logger = new Logger(MailProcessor.name)

	public constructor(private readonly mailService: ExtendedMailService) {
		super()
	}

	public async process(
		job: Job<{ email: string; subject: string; html: string }>
	): Promise<void> {
		const { email, subject, html } = job.data

		try {
			await this.mailService.send(email, subject, html)
		} catch (error) {
			//TODO: log bmq errors here
			this.logger.error(
				`❌ Error sending email to ${email}: ${error.message}`
			)
		}
	}
}
