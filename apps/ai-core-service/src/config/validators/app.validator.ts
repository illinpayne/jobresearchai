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
	public AICORE_GRPC_PORT: number

	@IsString()
	@IsNotEmpty()
	public AICORE_GRPC_HOST: string

	@IsEnum(Environment)
	public AICORE_NODE_ENV: string
}
