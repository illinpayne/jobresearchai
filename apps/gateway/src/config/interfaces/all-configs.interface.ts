import type { AppConfig } from './app.interface'
import type { JwtConfig } from './jwt.interface'
import { OAuthConfig } from './oauth.interface'
import { RedisConfig } from './redis.interface'
import { RmqConfig } from './rmq.interface'

export interface AllConfigs {
	app: AppConfig
	jwt: JwtConfig
	oauth: OAuthConfig
	rmq: RmqConfig
	redis: RedisConfig
}
