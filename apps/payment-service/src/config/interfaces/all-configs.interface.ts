import type { AppConfig } from './app.interface'
import { RmqConfig } from './rmq.interface'
import { StripeConfig } from './stripe.interface'

export interface AllConfigs {
	app: AppConfig
	rmq: RmqConfig
	stripe: StripeConfig
}
