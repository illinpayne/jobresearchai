import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class RmqValidator {
	@IsString()
	@IsNotEmpty()
	@Matches(/^amqp:\/\/[^:]+:[^@]+@[^:]+:\d+$/)
	public JOBS_RMQ_URL: string

	@IsString()
	@IsNotEmpty()
	public JOBS_RMQ_QUEUE: string
}
