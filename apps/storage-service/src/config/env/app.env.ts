import { registerAs } from '@nestjs/config'

import type { AppConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { AppValidator } from '../validators'

export const appEnv = registerAs<AppConfig>('app', () => {
	validateEnv(process.env, AppValidator)

	return {
		port: parseInt(process.env.GRPC_PORT as string, 10),
		host: process.env.GRPC_HOST,
		url: process.env.RMQ_URL,
		queue: process.env.RMQ_QUEUE,
		node_env: process.env.NODE_ENV
	} as AppConfig
})
