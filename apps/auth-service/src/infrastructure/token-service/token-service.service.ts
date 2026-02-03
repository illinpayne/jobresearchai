import { AllConfigs } from '@/config/interfaces'
import { JwtPayload, JwtTokens } from '@/shared/jwt.types'
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'

@Injectable()
export class TokenService {
	private readonly logger = new Logger(TokenService.name)
	constructor(private readonly jwtService: JwtService, private readonly config: ConfigService<AllConfigs>) {}

	public generateTokens(payload: JwtPayload): JwtTokens {
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.config.get('jwt.accessTokenTTL', {infer: true}),
		})

		const refreshToken = this.jwtService.sign(
			Object.assign({sub: payload.id}),
			{
				expiresIn: this.config.get('jwt.refreshTokenTTL', {infer: true})
			}
		)

		return {
			accessToken,
			refreshToken
		} as JwtTokens
	}

	public verifyToken(refreshToken: string) {
		try {
			this.jwtService.verify(refreshToken);
			return true;
		 
		} catch (error: any) {
			if (error instanceof TokenExpiredError) {
				this.logger.error(`Expired token [${refreshToken}]`)
			}
			return false;
		}
	}
	public decodeToken(refreshToken: string) {
		return this.jwtService.decode(refreshToken);
	}
}
