import { IsNotEmpty, IsString } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	public STORAGE_RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public STORAGE_RMQ_QUEUE: string
}
