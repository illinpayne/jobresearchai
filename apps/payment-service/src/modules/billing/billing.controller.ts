import {
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common'
import type { Request, Response } from 'express'

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
	public success(@Res({ passthrough: true }) res: Response) {
		res.redirect(`http://localhost:3000/getting-subscription`)
	}

	@Get('cancel')
	public cancel(@Res({ passthrough: true }) res: Response) {
		res.redirect(`http://localhost:3000/overview`)
	}
}
