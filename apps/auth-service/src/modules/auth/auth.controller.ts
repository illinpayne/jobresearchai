import { AUTH_SERVICE_NAME } from '@jrai/contracts/gen/auth'
import type {
	AuthResponse,
	ChangeEmailRequest,
	ForgotPasswordRequest,
	GoogleAccount,
	LoginRequest,
	RegisterSendOtpRequest,
	RegisterVerifyOtpRequest,
	ResendOTPRegisterRequest,
	ResetPasswordRequest,
	RevalidateSessionRequest,
	SendOTPEmailRequest,
	SendOtpResponse
} from '@jrai/contracts/gen/auth'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { AuthService } from './auth.service'

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@GrpcMethod(AUTH_SERVICE_NAME, 'SendRegisterOtp')
	public async sendRegisterOtp(
		request: RegisterSendOtpRequest
	): Promise<SendOtpResponse> {
		return await this.authService.sendOTPRegister(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'ResendRegisterOtp')
	public async resendRegisterOtp(
		request: ResendOTPRegisterRequest
	): Promise<SendOtpResponse> {
		return await this.authService.resendOTPRegister(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'VerifyRegisterOtp')
	public async verifyRegisterOtp(
		request: RegisterVerifyOtpRequest
	): Promise<AuthResponse> {
		return await this.authService.verifyRegisterAccount(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'Login')
	public async login(request: LoginRequest): Promise<AuthResponse> {
		return await this.authService.login(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'OAuthSignIn')
	public async oAuthSignin(request: GoogleAccount): Promise<AuthResponse> {
		return await this.authService.oAuthSignin(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'RevalidateSession')
	public async revalidate(
		request: RevalidateSessionRequest
	): Promise<AuthResponse> {
		return await this.authService.revalidateSession(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'ForgotPassword')
	public async forgotPassword(
		request: ForgotPasswordRequest
	): Promise<SendOtpResponse> {
		return await this.authService.forgotPassword(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'ResetPassword')
	public async resetPassword(
		request: ResetPasswordRequest
	): Promise<SendOtpResponse> {
		return await this.authService.resetPassword(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'SendChangeEmailOtp')
	public async sendChangeEmailOtp(
		request: SendOTPEmailRequest
	): Promise<SendOtpResponse> {
		return await this.authService.sendEmailOTP(request)
	}

	@GrpcMethod(AUTH_SERVICE_NAME, 'ChangeEmail')
	public async changeEmail(
		request: ChangeEmailRequest
	): Promise<SendOtpResponse> {
		return await this.authService.changeEmail(request)
	}
}
