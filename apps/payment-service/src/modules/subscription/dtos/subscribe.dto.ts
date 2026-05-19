import { BillingInterval } from '@prisma/generated/enums'
import { IsEmail, IsEnum, IsString } from 'class-validator'

export class SubscribeDto {
	@IsString()
	accountId: string

	@IsString()
	@IsEmail()
	email: string

	@IsString()
	planId: string

	@IsEnum(BillingInterval)
	interval: BillingInterval
}
