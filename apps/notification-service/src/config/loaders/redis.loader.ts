import { ConfigService } from '@nestjs/config'
import { RedisOptions } from 'bullmq'

import { AllConfigs } from '../interfaces'

export function getRedisConfig(
	configService: ConfigService<AllConfigs>
): RedisOptions {
	return {
		username: configService.get('redis.user', { infer: true }),
		password: configService.get('redis.password', { infer: true }),
		host: configService.get('redis.host', { infer: true }),
		port: configService.get('redis.port', { infer: true })
	}
}
