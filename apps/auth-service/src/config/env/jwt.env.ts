/* eslint-disable turbo/no-undeclared-env-vars */
import { registerAs } from '@nestjs/config';
import type { JwtConfig } from '../interfaces';
import { validateEnv } from '../utils/env';
import { JwtValidator } from '../validators';

export const jwtEnv = registerAs<JwtConfig>('jwt', () => {
	validateEnv(process.env, JwtValidator);

	return {
		jwtSecret: process.env.JWT_SECRET,
		accessTokenTTL: process.env.ACCESS_TOKEN_TTL,
		refreshTokenTTL: process.env.REFRESH_TOKEN_TTL,
	} as JwtConfig;
});
