import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class BuyBundleDto {
	@ApiProperty({ type: String, example: 'euDFGT4...' })
	@IsString()
	@IsNotEmpty()
	bundleId: string
}
