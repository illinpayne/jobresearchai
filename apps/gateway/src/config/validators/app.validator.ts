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
	public PORT: number

	@IsString()
	@IsNotEmpty()
	public HOST: string

	@IsString()
	public ALLOWED_ORIGINS: string

	@IsEnum(Environment)
	public NODE_ENV: string

	@IsString()
	@IsNotEmpty()
	public COOKIE_SECRET: string

	@IsInt()
	@Min(0)
	public COOKIE_EXPIRE_TTL: number

	@IsString()
	@IsNotEmpty()
	public COOKIE_DOMAIN: string
}
