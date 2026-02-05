import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import type { ConfigService } from '@nestjs/config'

import type { AllConfigs } from '../interfaces'

export function getCorsConfig(config: ConfigService<AllConfigs>): CorsOptions {
	return {
		origin: (
			config.get('app.allowed_origins', { infer: true }) as string
		).split(','),
		methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
	}
}
