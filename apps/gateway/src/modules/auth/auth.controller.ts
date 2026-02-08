import {
	LoginRequest,
	RegisterSendOtpRequest,
	RegisterVerifyOtpRequest,
	RevalidateSessionRequest
} from '@jrai/contracts/gen/auth'
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Logger,
	NotFoundException,
	Post,
	Req,
	Res,
	UnauthorizedException
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { Protected } from '@/common/decorators'
import { CookieType } from '@/common/enums/cookie.enum'
import { CookieService } from '@/infrastructure/cookie-service/cookie-service.service'

import { AuthClientGrpc } from './auth.grpc'
import { LoginDto } from './dtos/login.dto'
import { ResendOtpDto } from './dtos/resend-otp.dto'
import { SendOtpRegisterDto } from './dtos/send-otp-register.dto'
import { VerifyOTPRegister } from './dtos/verify-otp-register.dto'
import { AuthResponse } from './responses/auth.response'
import { LogoutResponse } from './responses/logout.response'
import { SendOtpRegisterResponse } from './responses/send-otp-register.response'

@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name)
	constructor(
		private readonly client: AuthClientGrpc,
		private readonly cookieService: CookieService
	) {}

	@ApiOperation({
		summary: 'Register new account',
		description: 'Sends OTP code to the email for verify'
	})
	@ApiOkResponse({
		description: 'Returns status and message',
		type: SendOtpRegisterResponse
	})
	@ApiConflictResponse({
		description: 'Account already exist, Cannot create account'
	})
	@ApiInternalServerErrorResponse({ description: 'Failed to send OTP' })
	@Post('send-otp-register')
	@HttpCode(HttpStatus.OK)
	async sendRegisterOTP(@Body() dto: SendOtpRegisterDto) {
		return await this.client.call(
			'sendRegisterOtp',
			dto as RegisterSendOtpRequest
		)
	}

	@ApiOperation({
		summary: 'Resend otp code for register',
		description: 'Sends OTP code to the email for verify'
	})
	@ApiOkResponse({
		description: 'Returns status and message',
		type: SendOtpRegisterResponse
	})
	@ApiNotFoundResponse({ description: 'Account not found' })
	@ApiConflictResponse({
		description: 'Resend not allowed yet, Account already created'
	})
	@ApiInternalServerErrorResponse({ description: 'Failed to send OTP' })
	@Post('resend-otp-register')
	@HttpCode(HttpStatus.OK)
	async resendRegisterOTP(@Body() dto: ResendOtpDto) {
		return await this.client.call(
			'resendRegisterOtp',
			dto as RegisterSendOtpRequest
		)
	}

	@ApiOperation({
		summary: 'Verify OTP code and log in',
		description: 'Verifies OTP code and log into account'
	})
	@ApiOkResponse({
		description: 'Returns authentication response',
		type: AuthResponse
	})
	@ApiConflictResponse({ description: 'Cannot verify account' })
	@ApiBadRequestResponse({ description: 'Code is not valid' })
	@ApiNotFoundResponse({
		description: 'Account not found'
	})
	@Post('verify-otp-register')
	@HttpCode(HttpStatus.OK)
	async verifyRegisterOTP(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: VerifyOTPRegister
	) {
		const { accessToken, account, refreshToken } = await this.client.call(
			'verifyRegisterOtp',
			dto as RegisterVerifyOtpRequest
		)
		this.passTokenViaCookies(res, refreshToken, dto.email)
		return { accessToken, account }
	}

	@ApiOperation({
		summary: 'Login into account',
		description: 'Login into existing account with defined credentials'
	})
	@ApiOkResponse({
		description: 'Returns authentication response',
		type: AuthResponse
	})
	@ApiNotFoundResponse({ description: 'Account not found' })
	@ApiConflictResponse({
		description:
			'Account is not completely registered, Password is not valid'
	})
	@Post('login')
	async login(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: LoginDto
	) {
		const { accessToken, account, refreshToken } = await this.client.call(
			'login',
			dto as LoginRequest
		)
		this.passTokenViaCookies(res, refreshToken, dto.email)
		return { accessToken, account }
	}

	@ApiOperation({
		summary: 'Revalidate session',
		description: 'Revalidates the session for the expired one'
	})
	@ApiOkResponse({
		description: 'Returns authentication response',
		type: AuthResponse
	})
	@ApiUnauthorizedResponse({
		description:
			'Session expired. Please login again, Session not found, please login first'
	})
	@ApiNotFoundResponse({ description: 'Account not found' })
	@Post('revalidate')
	async revalidateSession(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const cookieRefreshToken = req.cookies[CookieType.REFRESH_TOKEN]
		if (!cookieRefreshToken) {
			throw new UnauthorizedException(
				'Session not found, please login first'
			)
		}

		const { accessToken, account, refreshToken } = await this.client.call(
			'revalidateSession',
			{ refreshToken: cookieRefreshToken } as RevalidateSessionRequest
		)
		if (!account) {
			throw new NotFoundException('Account not found')
		}

		this.passTokenViaCookies(res, refreshToken, account.email)
		return { accessToken, account }
	}

	//TODO: Make endpoint authorized
	@ApiOperation({
		summary: 'Logout session',
		description: 'Logout from the account'
	})
	@ApiOkResponse({
		description: 'Successfully logged out',
		type: LogoutResponse
	})
	@ApiBearerAuth()
	@Post('logout')
	@Protected()
	@HttpCode(HttpStatus.OK)
	public logout(@Res({ passthrough: true }) res: Response) {
		this.cookieService.removeCookie(res, CookieType.REFRESH_TOKEN)
		return { status: HttpStatus.OK }
	}

	private passTokenViaCookies(
		response: Response,
		refreshToken: string,
		userData: string
	) {
		try {
			this.cookieService.setCookie(
				response,
				CookieType.REFRESH_TOKEN,
				refreshToken
			)
		} catch (error: any) {
			this.logger.error(
				error?.message || `Unable to pass refres token for ${userData}`
			)
		}
	}
}
