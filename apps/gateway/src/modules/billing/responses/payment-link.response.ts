import { ApiProperty } from '@nestjs/swagger'

export class PaymentLinkResponse {
	@ApiProperty({ type: String, example: 'https://billing.com/eu...' })
	url: string
}
