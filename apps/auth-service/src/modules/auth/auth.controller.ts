import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices'
import type { RegisterVerifyOtpRequest, RegisterSendOtpRequest, AuthResponse, RegisterSendOtpResponse, LoginRequest, RevalidateSessionRequest } from "@jrai/contracts/gen/auth" 
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SendRegisterOtp')
  public async sendRegisterOtp(request: RegisterSendOtpRequest) : Promise<RegisterSendOtpResponse> {
    return await this.authService.sendOTPRegister(request);
  }

  @GrpcMethod('AuthService', 'VerifyRegisterOtp')
  public async verifyRegisterOtp(request: RegisterVerifyOtpRequest) : Promise<AuthResponse> {
    return await this.authService.verifyRegisterAccount(request);
  }

  @GrpcMethod('AuthService', 'Login')
  public async login(request: LoginRequest) : Promise<AuthResponse> {
    return await this.authService.login(request);
  }

  @GrpcMethod('AuthService', 'RevalidateSession')
  public async revalidate(request: RevalidateSessionRequest) : Promise<AuthResponse> {
    return await this.authService.revalidateSession(request);
  }
}
