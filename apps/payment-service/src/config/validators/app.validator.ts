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
	public GRPC_PORT: number

	@IsString()
	@IsNotEmpty()
	public GRPC_HOST: string

	@IsString()
	@IsNotEmpty()
	public APP_URL: string

	@IsEnum(Environment)
	public NODE_ENV: string
}
