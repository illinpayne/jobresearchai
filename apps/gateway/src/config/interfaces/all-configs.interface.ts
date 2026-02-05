import type { AppConfig } from './app.interface';
import type { JwtConfig } from './jwt.interface'

export interface AllConfigs {
	app: AppConfig;
	jwt: JwtConfig;
}
