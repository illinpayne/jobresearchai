import { registerAs } from '@nestjs/config'

import type { AppConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { AppValidator } from '../validators'

export const appEnv = registerAs<AppConfig>('app', () => {
	validateEnv(process.env, AppValidator)

	return {
		port: parseInt(process.env.PORT as string, 10),
		host: process.env.GATEWAY_HOST,
		allowed_origins: process.env.GATEWAY_ALLOWED_ORIGINS,
		node_env: process.env.GATEWAY_NODE_ENV,
		cookie_secret: process.env.GATEWAY_COOKIE_SECRET,
		cookie_expire_ttl: parseInt(
			process.env.GATEWAY_COOKIE_EXPIRE_TTL as string,
			10
		),
		cookie_domain: process.env.COOKIE_DOMAIN
	} as AppConfig
})
