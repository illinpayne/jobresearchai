import { IsNotEmpty, IsString } from 'class-validator'

export class JwtValidator {
	@IsString()
	@IsNotEmpty()
	public AUTH_JWT_SECRET: string
	@IsString()
	@IsNotEmpty()
	public AUTH_ACCESS_TOKEN_TTL: string
	@IsString()
	@IsNotEmpty()
	public AUTH_REFRESH_TOKEN_TTL: string
}
