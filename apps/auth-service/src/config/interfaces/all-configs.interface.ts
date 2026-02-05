import type { AppConfig } from './app.interface'
import type { JwtConfig } from './jwt.interface'
import { RedisConfig } from './redis.interface'

export interface AllConfigs {
	app: AppConfig
	jwt: JwtConfig
	redis: RedisConfig
}
