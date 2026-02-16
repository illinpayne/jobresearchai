import { type UseQueryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { accountCacheKey, accountCacheStaleTime, CacheAccount } from '@/lib/cache';
import type { AccountResponse } from '../generated';
import { getMe } from '../requests/user.req';

export const useMe = (options?: Omit<UseQueryOptions<AccountResponse, unknown>, 'queryKey' | 'queryFn'>) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const saved = localStorage.getItem(accountCacheKey);
    if (!saved) return;
    const { data, createdAt } = JSON.parse(saved);

    if (!queryClient.getQueryData(['account'])) {
      queryClient.setQueryData(['account'], data, {
        updatedAt: createdAt,
      });
    }
  }, [queryClient]);

  return useQuery({
    queryKey: ['account'],
    queryFn: async () => {
      const data = await getMe();

      const cacheData = CacheAccount(data);
      localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
      return data;
    },
    retry: 3,
    staleTime: accountCacheStaleTime,
    refetchOnMount: true,
    ...options,
  });
};
