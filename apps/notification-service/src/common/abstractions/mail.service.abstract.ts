import { MailProps } from '@/infrastructure/mail/types/mail.types'

export abstract class MailService {
	public abstract addMailToQueue(job: MailProps): Promise<boolean>
}

export abstract class ExtendedMailService {
	public abstract send(
		email: string,
		subject: string,
		html: string
	): Promise<any>
}
