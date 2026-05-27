import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator'

export class RedisValidator {
	@IsString()
	@IsNotEmpty()
	public GATEWAY_REDIS_HOST: string

	@IsInt()
	@Min(0)
	@Max(65535)
	@IsOptional()
	public GATEWAY_REDIS_PORT: number

	@IsString()
	@IsNotEmpty()
	public GATEWAY_REDIS_USER: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_REDIS_PASSWORD: string
}
