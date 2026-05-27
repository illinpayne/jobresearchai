import { registerAs } from '@nestjs/config'

import type { SmtpConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { SmtpValidator } from '../validators'

export const smtpEnv = registerAs<SmtpConfig>('smtp', () => {
	validateEnv(process.env, SmtpValidator)

	return {
		host: process.env.NOTIFICATION_SMTP_HOST as string,
		port: Number(process.env.NOTIFICATION_SMTP_PORT),
		username: process.env.NOTIFICATION_SMTP_USERNAME as string,
		password: process.env.NOTIFICATION_SMTP_PASSWORD as string,
		from_address: process.env.NOTIFICATION_SMTP_FROM_ADDRESS as string,
		secure: process.env.NOTIFICATION_SMTP_SECURE === 'true',
		resend_api_token: process.env
			.NOTIFICATION_SMTP_RESEND_API_TOKEN as string
	} as SmtpConfig
})
