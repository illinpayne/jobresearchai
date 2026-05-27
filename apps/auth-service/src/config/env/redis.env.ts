import { registerAs } from '@nestjs/config'

import { type RedisConfig } from '../interfaces/redis.interface'
import { validateEnv } from '../utils/env'
import { RedisValidator } from '../validators/redis.validator'

export const redisEnv = registerAs<RedisConfig>('redis', () => {
	validateEnv(process.env, RedisValidator)

	return {
		host: process.env.AUTH_REDIS_HOST,
		port: parseInt(process.env.AUTH_REDIS_PORT as string, 10),
		user: process.env.AUTH_REDIS_USER,
		password: process.env.AUTH_REDIS_PASSWORD
	} as RedisConfig
})
