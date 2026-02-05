import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Response } from 'express'

import { AllConfigs } from '@/config/interfaces'
import { Environment } from '@/config/validators'

@Injectable()
export class CookieService {
	private readonly isDevelopment: boolean
	private readonly cookieDomain: string
	private readonly expireDate: Date
	constructor(private readonly config: ConfigService<AllConfigs>) {
		this.isDevelopment =
			this.config.get('app.node_env', { infer: true }) ===
			Environment.Development
		this.cookieDomain = this.config.get('app.cookie_domain', {
			infer: true
		}) as string

		const cookie_expire_ttl = this.config.get('app.cookie_expire_ttl', {
			infer: true
		}) as number
		this.expireDate = new Date(Date.now() + Number(cookie_expire_ttl))
	}

	public setCookie(
		response: Response,
		key: string,
		value: string,
		expires?: Date
	) {
		const sameSite = this.isDevelopment ? 'lax' : 'none'
		response.cookie(key, value, {
			httpOnly: true,
			domain: this.cookieDomain,
			expires: expires ?? this.expireDate,
			secure: !this.isDevelopment,
			sameSite,
			path: '/'
		})
	}

	public removeCookie(response: Response, key: string) {
		response.cookie(key, '', {
			httpOnly: true,
			domain: this.cookieDomain,
			expires: new Date(),
			secure: !this.isDevelopment,
			sameSite: this.isDevelopment ? 'lax' : 'none',
			path: '/'
		})
	}
}
