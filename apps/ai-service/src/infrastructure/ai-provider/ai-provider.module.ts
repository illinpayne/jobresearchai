import { Module } from '@nestjs/common'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'

import { LMStudioLocalProvider } from './providers/lm-studio-local.provider'

@Module({
	providers: [
		// {
		// 	provide: AiProvider,
		// 	useFactory: (config: ConfigService<AllConfigs>) => {
		// 		// const env = config.get('app.node_env', { infer: true })
		// 		// return env === Environment.Production
		// 		// 	? new OpenrouterProvider(config)
		// 		// 	: new LMStudioLocalProvider(config)
		// 		new LMStudioLocalProvider(config)
		// 	},
		// 	inject: [ConfigService]
		// }
		{
			provide: AiProvider,
			useClass: LMStudioLocalProvider
		}
	],
	exports: [AiProvider]
})
export class AiProviderModule {}
