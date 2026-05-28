import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'
import { AllConfigs } from '@/config/interfaces'
import { Environment } from '@/config/validators'

import { LMStudioLocalProvider } from './providers/lm-studio-local.provider'
import { OpenrouterProvider } from './providers/openrouter.provider'

@Module({
	providers: [
		{
			provide: AiProvider,
			useFactory: (config: ConfigService<AllConfigs>) => {
				const env = config.get('app.node_env', { infer: true })
				return env === Environment.Production
					? new OpenrouterProvider(config)
					: new LMStudioLocalProvider(config)
			},
			inject: [ConfigService]
		}
	],
	exports: [AiProvider]
})
export class AiProviderModule {}
