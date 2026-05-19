import { ApiProperty } from '@nestjs/swagger'

export class BundleModelResponse {
	@ApiProperty({ type: String, example: 'e1URAI...' })
	id: string
	@ApiProperty({ type: String, example: 'Basic' })
	name: string
	@ApiProperty({ type: Number, example: 50 })
	credits: number
	@ApiProperty({ type: Number, example: 2.99 })
	price: number
}

export class BundlesResponse {
	@ApiProperty({ type: [BundleModelResponse] })
	bundles: BundleModelResponse[]
}
