import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	@Matches(/^amqp:\/\/[^:]+:[^@]+@[^:]+:\d+$/)
	public RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_RMQ_AI_RESUME_QUEUE: string

	@IsString()
	@IsNotEmpty()
	public GATEWAY_RMQ_AI_EXCHANGE_QUEUE: string
}
