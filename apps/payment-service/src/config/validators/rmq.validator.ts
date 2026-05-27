import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	@Matches(/^amqp:\/\/[^:]+:[^@]+@[^:]+:\d+$/)
	public PAYMENT_RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public PAYMENT_RMQ_QUEUE: string
}
