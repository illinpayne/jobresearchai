import { registerAs } from '@nestjs/config'

import { OAuthConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { OAuthValidator } from '../validators'

export const oauthEnv = registerAs<OAuthConfig>('oauth', () => {
	validateEnv(process.env, OAuthValidator)

	return {
		clientId: process.env.GATEWAY_OAUTH_ID,
		secret: process.env.GATEWAY_OAUTH_SECRET,
		callbackUrl: process.env.GATEWAY_OAUTH_CALLBACK_URL,
		redirectUrl: process.env.GATEWAY_OAUTH_REDIRECT_URL,
		tokenKey: process.env.GATEWAY_OAUTH_TOKEN_KEY
	} as OAuthConfig
})
