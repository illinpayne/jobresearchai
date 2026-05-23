import { ApiProperty } from '@nestjs/swagger'

import { SimplifiedPlanModelResponse } from './plan.response'

export class SubscriptionModelResponse {
	@ApiProperty({ type: String, example: 'e1URAI...' })
	id: string
	@ApiProperty({ type: String, example: 'e1URAI...' })
	planId: string
	@ApiProperty({ type: String, example: 'ACTIVE' })
	status: string
	@ApiProperty({ type: String, example: 'MONTHLY' })
	interval: string
	@ApiProperty({ type: Boolean, example: false })
	cancelAtPeriodEnd: boolean
	@ApiProperty({ type: String, example: new Date().toISOString() })
	currentPeriodStart: string
	@ApiProperty({ type: String, example: new Date().toISOString() })
	currentPeriodEnd: string
	@ApiProperty({ type: Number, example: 500 })
	credits: number
	@ApiProperty({ type: SimplifiedPlanModelResponse })
	plan: SimplifiedPlanModelResponse
}
