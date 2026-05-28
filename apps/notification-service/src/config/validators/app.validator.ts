import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export enum Environment {
	Development = 'development',
	Production = 'production'
}

export class AppValidator {
	@IsString()
	@IsNotEmpty()
	public RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public NOTIFICATION_RMQ_QUEUE: string

	@IsEnum(Environment)
	public NODE_ENV: string
}
