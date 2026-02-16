import { IsNotEmpty, IsString } from 'class-validator'

export class OAuthValidator {
	@IsString()
	@IsNotEmpty()
	public OAUTH_ID: string

	@IsString()
	@IsNotEmpty()
	public OAUTH_SECRET: string

	@IsString()
	@IsNotEmpty()
	public OAUTH_CALLBACK_URL: string

	@IsString()
	@IsNotEmpty()
	public OAUTH_REDIRECT_URL: string

	@IsString()
	@IsNotEmpty()
	public OAUTH_TOKEN_KEY: string
}
