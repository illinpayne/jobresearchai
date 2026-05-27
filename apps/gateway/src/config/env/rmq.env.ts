import { registerAs } from '@nestjs/config'

import { RmqConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { RmqValidator } from '../validators'

export const rmqEnv = registerAs<RmqConfig>('rmq', () => {
	validateEnv(process.env, RmqValidator)

	return {
		urls: [process.env.GATEWAY_RMQ_URL as string],
		ai_queue: process.env.GATEWAY_RMQ_AI_RESUME_QUEUE as string,
		ai_exchange_queue: process.env.GATEWAY_RMQ_AI_EXCHANGE_QUEUE as string
	} as RmqConfig
})
