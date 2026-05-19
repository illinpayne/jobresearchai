import {
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common'
import { Request } from 'express'

import { BillingService } from './billing.service'

@Controller('billing')
export class BillingController {
	public constructor(private readonly billingService: BillingService) {}

	@Post('webhook')
	@HttpCode(HttpStatus.OK)
	async webhook(
		@Req() req: Request & { rawBody: Buffer },
		@Headers('stripe-signature') signature: string
	) {
		await this.billingService.handleWebhook(req.rawBody!, signature)
		return { received: true }
	}

	@Get('success')
	success() {
		return { message: 'Payment successful' }
	}

	@Get('cancel')
	cancel() {
		return { message: 'Payment cancelled' }
	}
}
