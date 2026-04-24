/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { QueryKeys } from '@/constants';
import { accountCacheKey, accountCacheStaleTime, CacheAccount, type CachedAccount } from '@/lib/cache';
import type { AccountResponse } from '../generated';
import { getMe } from '../requests/account.req';

export const useMe = (options?: Omit<UseQueryOptions<AccountResponse, unknown>, 'queryKey' | 'queryFn'>) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cached = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(accountCacheKey);
      if (!item) return null;
      const cache = JSON.parse(item) as CachedAccount;
      const age = Date.now() - cache.createdAt;
      return age > accountCacheStaleTime ? null : cache;
    } catch {
      return null;
    }
  }, [isMounted]);

  const query = useQuery({
    queryKey: [QueryKeys.MyAccount],
    queryFn: async () => {
      const data = await getMe();
      const cacheData = CacheAccount(data);
      localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
      return data;
    },
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.createdAt,
    staleTime: accountCacheStaleTime,
    enabled: isMounted && options?.enabled !== false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });

  return {
    ...query,
    data: isMounted ? query.data : undefined,
    isLoading: !isMounted || query.isLoading,
  };
};
