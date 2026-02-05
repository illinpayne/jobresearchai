import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
	@ApiProperty({type: String, default: 'tony.soprano@gmail.com'})
	@IsEmail()
	@IsNotEmpty({message: 'Email address should notbe empty'})
	email: string

	@ApiProperty({type: String, default: 'TuneBonFire78!'})
	@IsString({message: 'Password should be string'})
	@IsNotEmpty({message: 'Password should not be empty'})
	password: string
}