import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/constants';
import { accountCacheKey, accountCacheStaleTime, CacheAccount, type CachedAccount } from '@/lib/cache';
import type { AccountResponse } from '../generated';
import { getMe } from '../requests/account.req';

export const useMe = (options?: Omit<UseQueryOptions<AccountResponse, unknown>, 'queryKey' | 'queryFn'>) => {
  const getImmediateData = (): CachedAccount | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(accountCacheKey);
      if (!item) {
        return null;
      }

      const cache = JSON.parse(item) as CachedAccount;
      const age = Date.now() - cache.createdAt;
      if (age > accountCacheStaleTime) return null;
      return cache;
    } catch {
      return null;
    }
  };

  const initialData = getImmediateData();

  return useQuery({
    queryKey: [QueryKeys.MyAccount],
    queryFn: async () => {
      const data = await getMe();
      const cacheData = CacheAccount(data);
      localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
      return data;
    },
    initialData: initialData?.data || undefined,
    initialDataUpdatedAt: initialData?.createdAt || undefined,
    retry: 3,
    staleTime: accountCacheStaleTime,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!initialData && options?.enabled !== false,
    ...options,
  });
};
