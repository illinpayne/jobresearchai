import type { AppConfig } from './app.interface'
import type { AwsConfig } from './aws.interface'
import type { RmqConfig } from './rmq.interface'

export interface AllConfigs {
	app: AppConfig
	aws: AwsConfig
	rmq: RmqConfig
}
