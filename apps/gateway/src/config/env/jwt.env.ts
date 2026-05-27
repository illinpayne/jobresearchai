import { registerAs } from '@nestjs/config'

import { JwtConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { JwtValidator } from '../validators'

export const jwtEnv = registerAs<JwtConfig>('jwt', () => {
	validateEnv(process.env, JwtValidator)

	return {
		secret: process.env.GATEWAY_JWT_SECRET
	} as JwtConfig
})
