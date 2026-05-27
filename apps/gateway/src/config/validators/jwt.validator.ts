import { IsNotEmpty, IsString } from 'class-validator'

export class JwtValidator {
	@IsString()
	@IsNotEmpty()
	public GATEWAY_JWT_SECRET: string
}
