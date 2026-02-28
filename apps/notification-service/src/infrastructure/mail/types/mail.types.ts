import { OtpRequestEvent } from '@jrai/contracts'

export interface MailProps extends Omit<OtpRequestEvent, 'code'> {
	html: string
	subject: string
}
