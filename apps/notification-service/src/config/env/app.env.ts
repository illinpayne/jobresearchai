import { registerAs } from '@nestjs/config'

import type { AppConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { AppValidator } from '../validators'

export const appEnv = registerAs<AppConfig>('app', () => {
	validateEnv(process.env, AppValidator)

	return {
		url: process.env.NOTIFICATION_RMQ_URL,
		queue: process.env.NOTIFICATION_RMQ_QUEUE,
		node_env: process.env.NOTIFICATION_NODE_ENV
	} as AppConfig
})
