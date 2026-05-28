import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	@Matches(/^amqp:\/\/[^:]+:[^@]+@[^:]+:\d+$/)
	public RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public AIS_RMQ_QUEUE: string

	@IsString()
	@IsNotEmpty()
	public AIS_RMQ_EXCHANGE_QUEUE: string
}
