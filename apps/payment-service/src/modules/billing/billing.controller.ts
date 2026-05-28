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
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'

import { AllConfigs } from '@/config/interfaces'

import { BillingService } from './billing.service'

@Controller('billing')
export class BillingController {
	public constructor(
		private readonly config: ConfigService<AllConfigs>,
		private readonly billingService: BillingService
	) {}

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
		const url = this.config.get('app.redirect_url', { infer: true })
		res.redirect(`${url}/getting-subscription`)
	}

	@Get('cancel')
	public cancel(@Res({ passthrough: true }) res: Response) {
		const url = this.config.get('app.redirect_url', { infer: true })
		res.redirect(`${url}/overview`)
	}
}
