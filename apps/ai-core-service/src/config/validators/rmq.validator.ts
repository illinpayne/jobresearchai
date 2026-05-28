import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	@Matches(/^amqp:\/\/[^:]+:[^@]+@[^:]+:\d+$/)
	public RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public AICORE_RMQ_JOB_QUEUE: string
}
