import { registerAs } from '@nestjs/config'

import { type RedisConfig } from '../interfaces/redis.interface'
import { validateEnv } from '../utils/env'
import { RedisValidator } from '../validators/redis.validator'

export const redisEnv = registerAs<RedisConfig>('redis', () => {
	validateEnv(process.env, RedisValidator)

	return {
		host: process.env.REDIS_HOST as string,
		port: parseInt(process.env.REDIS_PORT as string, 10),
		user: process.env.REDIS_USER as string,
		password: process.env.REDIS_PASSWORD as string,
		bmq_prefix: process.env.NOTIFICATION_REDIS_BULLMQ_PREFIX as string
	} as RedisConfig
})
