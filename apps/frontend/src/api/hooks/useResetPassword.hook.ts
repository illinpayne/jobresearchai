import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { ResetPasswordDto, SendOtpResponse } from '../generated';
import { resetPassword } from '../requests/auth.req';

export const useResetPassword = (
  options?: Omit<UseMutationOptions<SendOtpResponse, unknown, ResetPasswordDto>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: ['reset-password'],
    mutationFn: (data: ResetPasswordDto) => resetPassword(data),
    ...options,
  });
