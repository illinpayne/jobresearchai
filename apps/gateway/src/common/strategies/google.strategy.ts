import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'

import { AllConfigs } from '@/config/interfaces'
import { GoogleAccount } from '@/modules/auth/models/google-user.model'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private readonly configService: ConfigService<AllConfigs>) {
		super({
			clientID: configService.get('oauth.clientId', {
				infer: true
			}) as string,
			clientSecret: configService.get('oauth.secret', {
				infer: true
			}) as string,
			callbackURL: configService.get('oauth.callbackUrl', {
				infer: true
			}) as string,
			scope: ['email', 'profile']
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback
	): Promise<any> {
		const { name, emails, photos } = profile
		const user: GoogleAccount = {
			email: emails[0].value,
			givenName: name.givenName,
			familyName: name.familyName,
			picture: photos[0].value,
			provider: 'google'
		}
		done(null, user)
	}
}
