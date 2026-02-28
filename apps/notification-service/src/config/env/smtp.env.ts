import { registerAs } from '@nestjs/config'

import type { SmtpConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { SmtpValidator } from '../validators'

export const smtpEnv = registerAs<SmtpConfig>('smtp', () => {
	validateEnv(process.env, SmtpValidator)

	return {
		host: process.env.SMTP_HOST as string,
		port: Number(process.env.SMTP_PORT),
		username: process.env.SMTP_USERNAME as string,
		password: process.env.SMTP_PASSWORD as string,
		from_address: process.env.SMTP_FROM_ADDRESS as string,
		secure: process.env.SMTP_SECURE === 'true',
		resend_api_token: process.env.SMTP_RESEND_API_TOKEN as string
	} as SmtpConfig
})
