import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSubscriptionDto {
	@ApiProperty({ type: String, example: 'euDFGT4...' })
	@IsString()
	@IsNotEmpty()
	planId: string

	@ApiProperty({ type: String, example: 'MONTHLY' })
	@IsString()
	@IsNotEmpty()
	interval: string
}
