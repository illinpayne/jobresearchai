import { Module } from '@nestjs/common'

import {
	DOUUA_STRATEGY_TOKEN,
	DouUaScrapperStrategy
} from './strategies/douua-scrapper.strategy'
import {
	WORKUA_STRATEGY_TOKEN,
	WorkUaScrapperStrategy
} from './strategies/workua-scrapper.strategy'

@Module({
	providers: [
		{
			provide: WORKUA_STRATEGY_TOKEN,
			useClass: WorkUaScrapperStrategy
		},
		{
			provide: DOUUA_STRATEGY_TOKEN,
			useClass: DouUaScrapperStrategy
		}
	],
	exports: [WORKUA_STRATEGY_TOKEN, DOUUA_STRATEGY_TOKEN]
})
export class ScrapperModule {}
