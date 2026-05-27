import { IsNotEmpty, IsString } from 'class-validator'

export class OAuthValidator {
	@IsString()
	@IsNotEmpty()
	public GATEWAY_OAUTH_ID: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_OAUTH_SECRET: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_OAUTH_CALLBACK_URL: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_OAUTH_REDIRECT_URL: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_OAUTH_TOKEN_KEY: string
}
