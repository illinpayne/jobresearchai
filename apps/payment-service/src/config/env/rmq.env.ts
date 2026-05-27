import { registerAs } from '@nestjs/config'

import { RmqConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { RmqValidator } from '../validators'

export const rmqEnv = registerAs<RmqConfig>('rmq', () => {
	validateEnv(process.env, RmqValidator)

	return {
		urls: [process.env.PAYMENT_RMQ_URL as string],
		queue: process.env.PAYMENT_RMQ_QUEUE as string
	} as RmqConfig
})
