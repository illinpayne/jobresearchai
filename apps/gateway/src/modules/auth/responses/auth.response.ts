import { ApiProperty } from '@nestjs/swagger'

import { AccountResponse } from '@/modules/user/responses/account.response'

export class AuthResponse {
	@ApiProperty({ type: String, default: 'eyfBcvvbh465...' })
	accessToken: string

	@ApiProperty({
		type: AccountResponse,
		default: {
			email: 'tony.soprano@gmail.com',
			firstName: 'Tony',
			secondName: 'Soprano',
			isEmailVerified: true
		} as AccountResponse
	})
	account: AccountResponse
}
