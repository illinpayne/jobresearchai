import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { ResendOtpDto, SendOtpResponse } from '../generated';
import { resendOtpRegister } from '../requests/auth.req';

export const useResendRegisterOtp = (
  options?: Omit<UseMutationOptions<SendOtpResponse, unknown, ResendOtpDto>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: ['resend-register-otp'],
    mutationFn: (data: ResendOtpDto) => resendOtpRegister(data),
    ...options,
  });
