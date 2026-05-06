import { ApiProperty } from '@nestjs/swagger'

import { CustomerProfileDto } from './customer-profile.dto'

export class ExtendedCustomerProfileDto {
	@ApiProperty({ type: CustomerProfileDto })
	profile: CustomerProfileDto
	@ApiProperty({ type: String })
	presetName: string
	@ApiProperty({ type: Number })
	spentCredits: number
}

export class AccountProfilesResponse {
	@ApiProperty({ type: [ExtendedCustomerProfileDto] })
	data: ExtendedCustomerProfileDto[]
}
