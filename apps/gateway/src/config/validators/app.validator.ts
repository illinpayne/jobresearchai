import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator'

export enum Environment {
	Development = 'development',
	Production = 'production'
}

export class AppValidator {
	@IsInt()
	@Min(0)
	@Max(65535)
	@IsOptional()
	public GATEWAY_PORT: number

	@IsString()
	@IsNotEmpty()
	public GATEWAY_HOST: string

	@IsString()
	public GATEWAY_ALLOWED_ORIGINS: string

	@IsEnum(Environment)
	public GATEWAY_NODE_ENV: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_COOKIE_SECRET: string

	@IsInt()
	@Min(0)
	public GATEWAY_COOKIE_EXPIRE_TTL: number

	@IsString()
	@IsNotEmpty()
	public GATEWAY_COOKIE_DOMAIN: string
}
