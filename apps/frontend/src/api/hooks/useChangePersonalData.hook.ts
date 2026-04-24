import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import { accountCacheKey, MakeCacheAccount } from '@/lib/cache';
import type { AccountResponse, ChangePersonalDataDto } from '../generated';
import { changePersonalData } from '../requests/account.req';

export const useChangePersonalData = (
  options?: Omit<UseMutationOptions<AccountResponse, unknown, ChangePersonalDataDto>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: ['change-personal-data'],
    mutationFn: async (data: ChangePersonalDataDto) => {
      const result = await changePersonalData(data);
      const cacheData = MakeCacheAccount(result);
      localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
      return result;
    },
    ...options,
  });
