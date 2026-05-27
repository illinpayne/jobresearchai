import { registerAs } from '@nestjs/config'

import type { JwtConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { JwtValidator } from '../validators'

export const jwtEnv = registerAs<JwtConfig>('jwt', () => {
	validateEnv(process.env, JwtValidator)

	return {
		jwtSecret: process.env.AUTH_JWT_SECRET,
		accessTokenTTL: process.env.AUTH_ACCESS_TOKEN_TTL,
		refreshTokenTTL: process.env.AUTH_REFRESH_TOKEN_TTL
	} as JwtConfig
})
