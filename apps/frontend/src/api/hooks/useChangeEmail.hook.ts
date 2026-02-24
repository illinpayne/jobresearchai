import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { ChangeEmailDto, SendOtpResponse } from '../generated';
import { changeEmail } from '../requests/auth.req';

export const useChangeEmail = (
  options?: Omit<UseMutationOptions<SendOtpResponse, unknown, ChangeEmailDto>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: ['change-email'],
    mutationFn: (data: ChangeEmailDto) => changeEmail(data),
    ...options,
  });
