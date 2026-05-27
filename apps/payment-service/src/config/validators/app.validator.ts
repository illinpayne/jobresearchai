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
	public PAYMENT_GRPC_PORT: number

	@IsString()
	@IsNotEmpty()
	public PAYMENT_GRPC_HOST: string

	@IsString()
	@IsNotEmpty()
	public PAYMENT_APP_URL: string

	@IsEnum(Environment)
	public PAYMENT_NODE_ENV: string
}
