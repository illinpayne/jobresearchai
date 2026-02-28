import type { AppConfig } from './app.interface'
import { RedisConfig } from './redis.interface'
import type { SmtpConfig } from './smtp.interface'

export interface AllConfigs {
	app: AppConfig
	smtp: SmtpConfig
	redis: RedisConfig
}
