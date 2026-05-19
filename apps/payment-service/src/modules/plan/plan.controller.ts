import { PAYMENT_SERVICE_NAME } from '@jrai/contracts/gen/payment'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { PlanService } from './plan.service'

@Controller()
export class PlanController {
	public constructor(private readonly planService: PlanService) {}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'GetPlans')
	public async getPlans() {
		const plans = await this.planService.findAll()
		return { plans }
	}
}
