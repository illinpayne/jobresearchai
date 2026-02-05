import { registerAs } from '@nestjs/config'
import { JwtConfig } from '../interfaces'
import { JwtValidator } from '../validators/jwt.validator'
import { validateEnv } from '../utils/env'

export const jwtEnv = registerAs<JwtConfig>('jwt', () => {
	validateEnv(process.env, JwtValidator);

	return {
		secret: process.env.JWT_SECRET,
	} as JwtConfig;
});
