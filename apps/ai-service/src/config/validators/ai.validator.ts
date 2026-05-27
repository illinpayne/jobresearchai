import { IsNotEmpty, IsString } from 'class-validator'

export class AiValidator {
	@IsString()
	@IsNotEmpty()
	public AIS_AI_SERVER_URL: string

	@IsString()
	@IsNotEmpty()
	public AIS_AI_API_KEY: string
}
