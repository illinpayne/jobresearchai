import { removeSessionToken } from '@/lib/cookies';
import type {
  AuthResponse,
  ForgotPasswordDto,
  LoginDto,
  ResendOtpDto,
  ResetPasswordDto,
  SendOtpRegisterDto,
  SendOtpResponse,
  VerifyOTPRegister,
} from '../generated';
import { api, instance } from '../instance';

export enum AuthEndpoints {
  LOGIN = '/auth/login',
  SEND_OTP_REGISTER = '/auth/send-otp-register',
  VERIFY_OTP_REGISTER = '/auth/verify-otp-register',
  RESEND_OTP_REGISTER = '/auth/resend-otp-register',
  FORGOT_OTP_REGISTER = '/auth/forgot-password',
  RESET_OTP_REGISTER = '/auth/reset-password',
  REVALIDATE = '/auth/revalidate',
  LOGOUT = '/auth/logout',
}

export const login = async (dto: LoginDto) => await api.post<AuthResponse>(AuthEndpoints.LOGIN, dto).then((response) => response.data);

export const sendRegisterOtp = async (dto: SendOtpRegisterDto) =>
  await api.post<SendOtpResponse>(AuthEndpoints.SEND_OTP_REGISTER, dto).then((response) => response.data);

export const verifyRegisterOtp = async (dto: VerifyOTPRegister) =>
  await api.post<AuthResponse>(AuthEndpoints.VERIFY_OTP_REGISTER, dto).then((response) => response.data);

export const resendOtpRegister = async (dto: ResendOtpDto) =>
  await api.post<SendOtpResponse>(AuthEndpoints.RESEND_OTP_REGISTER, dto).then((response) => response.data);

export const forgotPassword = async (dto: ForgotPasswordDto) =>
  await api.post<SendOtpResponse>(AuthEndpoints.FORGOT_OTP_REGISTER, dto).then((response) => response.data);

export const resetPassword = async (dto: ResetPasswordDto) =>
  await api.post<SendOtpResponse>(AuthEndpoints.RESET_OTP_REGISTER, dto).then((response) => response.data);

export const refresh = async () => await api.post<AuthResponse>(AuthEndpoints.REVALIDATE).then((response) => response.data);

export const logout = async () => await instance.post<boolean>(AuthEndpoints.LOGOUT).then(() => removeSessionToken());
