import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SendOtpRegisterDto {
	@ApiProperty({type: String, default: 'tony.soprano@gmail.com'})
	@IsEmail()
	@IsNotEmpty({message: 'Email address should not be empty'})
	email: string

	@ApiProperty({type: String, default: 'Tony'})
	@IsString({message: 'First name should be string'})
	@IsNotEmpty({message: 'First name should not be empty'})
	firstName: string

	@ApiProperty({type: String, default: 'Soprano'})
	@IsString({message: 'Second Name should be string'})
	@IsNotEmpty({message: 'Second name should not be empty'})
	secondName: string

	@ApiProperty({type: String, example: 'TuneBonFire78!'})
	@IsString({message: 'Password should be string'})
	@IsNotEmpty({message: 'Password should not be empty'})
	password: string
}