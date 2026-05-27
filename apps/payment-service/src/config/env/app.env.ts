import { registerAs } from '@nestjs/config'

import type { AppConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { AppValidator } from '../validators'

export const appEnv = registerAs<AppConfig>('app', () => {
	validateEnv(process.env, AppValidator)

	return {
		port: parseInt(process.env.PAYMENT_GRPC_PORT as string, 10),
		host: process.env.PAYMENT_GRPC_HOST,
		app_url: process.env.PAYMENT_APP_URL,
		node_env: process.env.PAYMENT_NODE_ENV
	} as AppConfig
})
