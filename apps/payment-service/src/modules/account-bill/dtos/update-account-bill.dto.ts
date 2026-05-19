import { IsEmail, IsInt, IsOptional, Min } from 'class-validator'

export class UpdateAccountBillDto {
	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsInt()
	@Min(0)
	credits?: number
}
