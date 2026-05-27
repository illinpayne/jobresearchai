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
	public STORAGE_GRPC_PORT: number

	@IsString()
	@IsNotEmpty()
	public STORAGE_GRPC_HOST: string

	@IsEnum(Environment)
	public STORAGE_NODE_ENV: string
}
