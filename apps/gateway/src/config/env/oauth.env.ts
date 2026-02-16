import { registerAs } from '@nestjs/config'

import { OAuthConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { OAuthValidator } from '../validators'

export const oauthEnv = registerAs<OAuthConfig>('oauth', () => {
	validateEnv(process.env, OAuthValidator)

	return {
		oAuthID: process.env.OAUTH_ID,
		oAuthSecret: process.env.OAUTH_SECRET,
		oAuthCallbackUrl: process.env.OAUTH_CALLBACK_URL
	} as OAuthConfig
})
