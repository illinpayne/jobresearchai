import { IsNotEmpty, IsString } from 'class-validator'

export class JwtValidator {
	@IsString()
	@IsNotEmpty()
	public JWT_SECRET: string
	@IsString()
	@IsNotEmpty()
	public ACCESS_TOKEN_TTL: string
	@IsString()
	@IsNotEmpty()
	public REFRESH_TOKEN_TTL: string
}
