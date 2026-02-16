import {
	AUTH_SERVICE_NAME,
	type AuthResponse,
	type ForgotPasswordRequest,
	type LoginRequest,
	type RegisterSendOtpRequest,
	type RegisterVerifyOtpRequest,
	type ResendOTPRegisterRequest,
	type ResetPasswordRequest,
	type RevalidateSessionRequest,
	type SendOtpResponse
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
}
