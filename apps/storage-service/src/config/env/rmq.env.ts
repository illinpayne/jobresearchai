import { registerAs } from '@nestjs/config'

import type { RmqConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { RmqValidator } from '../validators'

export const rmqEnv = registerAs<RmqConfig>('rmq', () => {
	validateEnv(process.env, RmqValidator)

	return {
		url: process.env.RMQ_URL,
		queue: process.env.RMQ_QUEUE
	} as RmqConfig
})
