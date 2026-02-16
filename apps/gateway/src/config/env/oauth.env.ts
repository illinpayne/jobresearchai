import { registerAs } from '@nestjs/config'

import { OAuthConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { OAuthValidator } from '../validators'

export const oauthEnv = registerAs<OAuthConfig>('oauth', () => {
	validateEnv(process.env, OAuthValidator)

	return {
		clientId: process.env.OAUTH_ID,
		secret: process.env.OAUTH_SECRET,
		callbackUrl: process.env.OAUTH_CALLBACK_URL,
		redirectUrl: process.env.OAUTH_REDIRECT_URL,
		tokenKey: process.env.OAUTH_TOKEN_KEY
	} as OAuthConfig
})
