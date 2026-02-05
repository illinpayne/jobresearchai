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
	public REDIS_HOST: string

	@IsInt()
	@Min(0)
	@Max(65535)
	@IsOptional()
	public REDIS_PORT: number

	@IsString()
	@IsNotEmpty()
	public REDIS_USER: string

	@IsString()
	@IsNotEmpty()
	public REDIS_PASSWORD: string
}
