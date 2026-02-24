import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { LogoutResponse } from '../generated';
import { logout } from '../requests/auth.req';

export const useLogout = (options?: Omit<UseMutationOptions<LogoutResponse, unknown, void>, 'mutationKey' | 'mutationFn'>) =>
  useMutation({
    mutationKey: ['logout'],
    mutationFn: () => logout(),
    ...options,
  });
