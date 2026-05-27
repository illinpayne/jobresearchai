import { registerAs } from '@nestjs/config'

import type { AppConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { AppValidator } from '../validators'

export const appEnv = registerAs<AppConfig>('app', () => {
	validateEnv(process.env, AppValidator)

	return {
		port: parseInt(process.env.AUTH_GRPC_PORT as string, 10),
		host: process.env.AUTH_GRPC_HOST,
		node_env: process.env.AUTH_NODE_ENV
	} as AppConfig
})
