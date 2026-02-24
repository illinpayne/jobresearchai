import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { SendOtpResponse } from '../generated';
import { sendEmailOTP } from '../requests/auth.req';

export const useSendEmailOTP = (options?: Omit<UseMutationOptions<SendOtpResponse, unknown, void>, 'mutationKey' | 'mutationFn'>) =>
  useMutation({
    mutationKey: ['send-email-otp'],
    mutationFn: () => sendEmailOTP(),
    ...options,
  });
