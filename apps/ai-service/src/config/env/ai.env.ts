import { registerAs } from '@nestjs/config'

import { AiConfig } from '../interfaces'
import { validateEnv } from '../utils/env'
import { AiValidator } from '../validators'

export const aiEnv = registerAs<AiConfig>('ai', () => {
	validateEnv(process.env, AiValidator)

	return {
		url: process.env.AIS_AI_SERVER_URL as string,
		apiKey: process.env.AIS_AI_API_KEY as string
	} as AiConfig
})
