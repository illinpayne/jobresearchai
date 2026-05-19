import { ApiProperty } from '@nestjs/swagger'

export class PlanModelResponse {
	@ApiProperty({ type: String, example: 'e1URAI...' })
	id: string
	@ApiProperty({ type: String, example: 'Basic' })
	name: string
	@ApiProperty({ type: Number, example: 250 })
	grantedCredits: number
	@ApiProperty({ type: Number, example: 3 })
	trialDays: number
}

export class PlansResponse {
	@ApiProperty({ type: [PlanModelResponse] })
	plans: PlanModelResponse[]
}
