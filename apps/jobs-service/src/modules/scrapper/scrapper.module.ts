import { Module } from '@nestjs/common'

import {
	WORKUA_STRATEGY_TOKEN,
	WorkuaScrapperStrategy
} from './strategies/workua-scrapper.strategy'

@Module({
	providers: [
		{
			provide: WORKUA_STRATEGY_TOKEN,
			useClass: WorkuaScrapperStrategy
		}
	],
	exports: [WORKUA_STRATEGY_TOKEN]
})
export class ScrapperModule {}
