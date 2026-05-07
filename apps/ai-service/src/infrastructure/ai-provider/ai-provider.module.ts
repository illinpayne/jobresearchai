import { Module } from '@nestjs/common'

import { AiProvider } from '@/common/abstractions/ai-provider.abstract'

import { LMStudioLocalProvider } from './providers/lm-studio-local.provider'

@Module({
	providers: [
		{
			provide: AiProvider,
			useClass: LMStudioLocalProvider
		}
	],
	exports: [AiProvider]
})
export class AiProviderModule {}
