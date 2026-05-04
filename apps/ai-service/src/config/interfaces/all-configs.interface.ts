import { AiConfig } from './ai.interface'
import type { AppConfig } from './app.interface'
import { RmqConfig } from './rmq.interface'

export interface AllConfigs {
	app: AppConfig
	rmq: RmqConfig
	ai: AiConfig
}
