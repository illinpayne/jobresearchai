import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { AccountResponse } from '../generated';
import { updateAvatar } from '../requests/account.req';

export const useChangeAvatar = (options?: Omit<UseMutationOptions<AccountResponse, unknown, FormData>, 'mutationKey' | 'mutationFn'>) =>
  useMutation({
    mutationKey: ['change-avatar'],
    mutationFn: (data: FormData) => updateAvatar(data),
    ...options,
  });
