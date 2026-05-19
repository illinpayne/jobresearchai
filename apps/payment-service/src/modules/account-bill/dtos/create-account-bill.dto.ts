import { IsEmail, IsString } from 'class-validator'

export class CreateAccountBillDto {
	@IsString()
	accountId: string

	@IsEmail()
	email: string
}
