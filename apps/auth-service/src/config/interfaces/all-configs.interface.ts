import type { AppConfig } from './app.interface'
import type { JwtConfig } from './jwt.interface'
import type { RedisConfig } from './redis.interface'
import type { RmqConfig } from './rmq.interface'

export interface AllConfigs {
	app: AppConfig
	jwt: JwtConfig
	redis: RedisConfig
	rmq: RmqConfig
}
