import type {
  QueryClient,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { AccountResponse } from "@/api/generated";
import { instance } from "@/api/instance";
import { accountCacheKey, CacheAccount } from "../cache";
import { setSessionToken } from "../cookies";

export interface PersistSessionProps {
  accessToken: string;
  account: AccountResponse;
  queryClient: QueryClient;
}

export interface RefetchSessionProps<T> extends Omit<
  PersistSessionProps,
  "account"
> {
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<T, unknown>>;
}

export function persistSession(props: PersistSessionProps) {
  const { accessToken, account, queryClient } = props;

  setSessionToken(accessToken);
  instance.defaults.headers["Authorization"] = accessToken;
  const cacheData = CacheAccount(account);

  localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
  queryClient.setQueryData(["account"], account, {
    updatedAt: Date.now(),
  });
}

export async function refetchSession<T extends AccountResponse>(
  props: RefetchSessionProps<T>,
) {
  const { accessToken, queryClient, refetch } = props;

  setSessionToken(accessToken);
  instance.defaults.headers["Authorization"] = accessToken;

  const { data: userData, isSuccess } = await refetch();

  if (isSuccess && userData) {
    const cacheData = CacheAccount(userData);
    localStorage.setItem(accountCacheKey, JSON.stringify(cacheData));
    queryClient.setQueryData(["account"], userData, {
      updatedAt: Date.now(),
    });
  }
  return isSuccess;
}
