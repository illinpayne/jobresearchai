import { ConfigService } from '@nestjs/config'
import { QueueOptions } from 'bullmq'

import { AllConfigs } from '../interfaces'

import { getRedisConfig } from './redis.loader'

export function getBullmqLoader(
	configService: ConfigService<AllConfigs>
): QueueOptions {
	return {
		connection: {
			...getRedisConfig(configService),
			maxRetriesPerRequest: null,
			retryStrategy: times => Math.min(times * 50, 2000)
		},
		prefix: configService.get('redis.bmq_prefix', { infer: true }),
		defaultJobOptions: {
			removeOnFail: {
				count: 5
			},
			attempts: 3,
			backoff: {
				type: 'exponential',
				delay: 1000
			}
		}
	}
}
