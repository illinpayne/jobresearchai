import { ApiProperty } from '@nestjs/swagger'

export class PlanModelResponse {
	@ApiProperty({ type: String, example: 'e1URAI...' })
	id: string
	@ApiProperty({ type: String, example: 'Basic' })
	name: string
	@ApiProperty({ type: String, example: 'Flexible plan to get' })
	description: string
	@ApiProperty({ type: Number, example: 250 })
	grantedCredits: number
	@ApiProperty({ type: Number, example: 3 })
	trialDays: number
	@ApiProperty({ type: Number, example: 10 })
	monthlyPrice: number
	@ApiProperty({ type: Number, example: 120 })
	annualPrice: number
	@ApiProperty({ type: [String] })
	benefits: string[]
}

export class SimplifiedPlanModelResponse {
	@ApiProperty({ type: String, example: 'e1URAI...' })
	id: string
	@ApiProperty({ type: String, example: 'Basic' })
	name: string
	@ApiProperty({ type: String, example: 'Flexible plan to get' })
	description: string
	@ApiProperty({ type: Number, example: 250 })
	grantedCredits: number
	@ApiProperty({ type: Number, example: 3 })
	trialDays: number
	@ApiProperty({ type: Number, example: 10 })
	monthlyPrice: number
	@ApiProperty({ type: Number, example: 120 })
	annualPrice: number
}

export class PlansResponse {
	@ApiProperty({ type: [PlanModelResponse] })
	plans: PlanModelResponse[]
}
