import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	@Matches(/^amqp:\/\/[^:]+:[^@]+@[^:]+:\d+$/)
	public AUTH_RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public AUTH_RMQ_QUEUE: string
}
