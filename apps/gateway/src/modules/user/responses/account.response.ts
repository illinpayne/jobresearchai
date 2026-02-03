import { ApiProperty } from '@nestjs/swagger'

export class AccountResponse {
	@ApiProperty({type: String, default: 'tony.soprano@gmail.com'})
	email: string

	@ApiProperty({type: String, default: 'Tony'})
	firstName: string

	@ApiProperty({type: String, default: 'Soprano'})
	secondName: string

	@ApiProperty({type: String, default: 'https://i.pravatar.cc/150'})
	avatar: string

	@ApiProperty({type: Boolean, default: true})
	isEmailVerified: boolean
}