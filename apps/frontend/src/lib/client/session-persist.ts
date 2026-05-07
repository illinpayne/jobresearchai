import type { QueryClient, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import type { AccountResponse } from '@/api/generated';
import { instance } from '@/api/instance';
import { QueryKeys } from '@/constants';
import { accountCacheKey, aiModelCacheKey, changeEmailCacheKey, changePasswordCacheKey, DisposeCache, MakeCacheAccount } from '../cache';
import { removeSessionToken, setSessionToken } from '../cookies';

export interface PersistSessionProps {
  accessToken: string;
  account: AccountResponse;
  queryClient: QueryClient;
}

export interface RefetchSessionProps<T> extends Omit<PersistSessionProps, 'account'> {
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<T, unknown>>;
}

export function persistSession(props: PersistSessionProps) {
  const { accessToken, account, queryClient } = props;
  setSessionToken(accessToken);
  instance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  const cacheData = MakeCacheAccount(account);

  localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
  queryClient.setQueryData([QueryKeys.MyAccount], account, {
    updatedAt: Date.now(),
  });
}

export async function refetchSession<T extends AccountResponse>(props: RefetchSessionProps<T>) {
  const { accessToken, queryClient, refetch } = props;

  setSessionToken(accessToken);
  instance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

  const { data: userData, isSuccess } = await refetch();

  if (isSuccess && userData) {
    const cacheData = MakeCacheAccount(userData);
    localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
    queryClient.setQueryData([QueryKeys.MyAccount], userData, {
      updatedAt: Date.now(),
    });
  }
  return isSuccess;
}

export async function cleanSession(queryClient: QueryClient) {
  removeSessionToken();
  instance.defaults.headers['Authorization'] = '';
  DisposeCache();
  queryClient.removeQueries({ queryKey: [QueryKeys.MyAccount] });
}
