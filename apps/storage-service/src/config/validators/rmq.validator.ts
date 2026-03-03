import { IsNotEmpty, IsString } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	public RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public RMQ_QUEUE: string
}
