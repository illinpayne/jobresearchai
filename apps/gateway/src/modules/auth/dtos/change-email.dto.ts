import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator'

export class ChangeEmailDto {
	@ApiProperty({ type: String, default: 'tony.soprano@gmail.com' })
	@IsEmail()
	@IsNotEmpty({ message: 'Email address should not be empty' })
	newEmail: string

	@ApiProperty({ type: String, default: '789456' })
	@IsNotEmpty({ message: 'Code should not be empty' })
	@IsNumberString({}, { message: 'Code should be only numbers' })
	code: string
}
