import { registerAs } from '@nestjs/config'

import { AiConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { AiValidator } from '../validators'

export const aiEnv = registerAs<AiConfig>('ai', () => {
	validateEnv(process.env, AiValidator)

	return {
		url: process.env.AI_SERVER_URL as string,
		apiKey: process.env.AI_API_KEY as string
	} as AiConfig
})
