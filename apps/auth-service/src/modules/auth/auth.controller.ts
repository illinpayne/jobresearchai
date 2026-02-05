import type {
	AuthResponse,
	LoginRequest,
	RegisterSendOtpRequest,
	RegisterVerifyOtpRequest,
	ResendOTPRegisterRequest,
	RevalidateSessionRequest,
	SendOtpResponse
} from '@jrai/contracts/gen/auth'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { AuthService } from './auth.service'

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@GrpcMethod('AuthService', 'SendRegisterOtp')
	public async sendRegisterOtp(
		request: RegisterSendOtpRequest
	): Promise<SendOtpResponse> {
		return await this.authService.sendOTPRegister(request)
	}

	@GrpcMethod('AuthService', 'ResendRegisterOtp')
	public async resendRegisterOtp(
		request: ResendOTPRegisterRequest
	): Promise<SendOtpResponse> {
		return await this.authService.resendOTPRegister(request)
	}

	@GrpcMethod('AuthService', 'VerifyRegisterOtp')
	public async verifyRegisterOtp(
		request: RegisterVerifyOtpRequest
	): Promise<AuthResponse> {
		return await this.authService.verifyRegisterAccount(request)
	}

	@GrpcMethod('AuthService', 'Login')
	public async login(request: LoginRequest): Promise<AuthResponse> {
		return await this.authService.login(request)
	}

	@GrpcMethod('AuthService', 'RevalidateSession')
	public async revalidate(
		request: RevalidateSessionRequest
	): Promise<AuthResponse> {
		return await this.authService.revalidateSession(request)
	}
}
