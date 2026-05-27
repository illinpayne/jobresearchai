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
	public NOTIFICATION_REDIS_HOST: string

	@IsInt()
	@Min(0)
	@Max(65535)
	@IsOptional()
	public NOTIFICATION_REDIS_PORT: number

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_REDIS_USER: string

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_REDIS_PASSWORD: string

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_REDIS_BULLMQ_PREFIX: string
}
