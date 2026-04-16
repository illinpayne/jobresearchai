import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResendOtpDto {
	@ApiProperty({ type: String, default: 'tony.soprano@gmail.com' })
	@IsEmail({}, { message: 'Email address is not correct' })
	@IsNotEmpty({ message: 'Email address should not be empty' })
	email!: string
}
