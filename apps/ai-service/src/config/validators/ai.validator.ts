import { IsNotEmpty, IsString } from 'class-validator'

export class AiValidator {
	@IsString()
	@IsNotEmpty()
	public AI_SERVER_URL: string

	@IsString()
	@IsNotEmpty()
	public AI_API_KEY: string
}
