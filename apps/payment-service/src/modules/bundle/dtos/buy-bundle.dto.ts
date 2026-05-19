import { IsString } from 'class-validator'

export class BuyBundleDto {
	@IsString()
	accountId: string

	@IsString()
	bundleId: string
}
