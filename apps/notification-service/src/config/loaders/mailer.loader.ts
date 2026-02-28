import type { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

import { AllConfigs } from '../interfaces'

export function getMailerConfig(
	configService: ConfigService<AllConfigs>
): MailerOptions {
	return {
		transport: {
			host: configService.get<string>('smtp.host', { infer: true }),
			port: configService.get<number>('smtp.port', { infer: true }),
			secure: configService.get<boolean>('smtp.secure', { infer: true }),
			auth: {
				user: configService.get<string>('smtp.username', {
					infer: true
				}),
				pass: configService.get<string>('smtp.password', {
					infer: true
				})
			}
		},
		defaults: {
			from: `JobResearcher AI ${configService.get<string>('smtp.from_address', { infer: true })}`
		}
	}
}
