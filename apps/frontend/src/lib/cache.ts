import type { AccountResponse } from "@/api/generated";

export const accountCacheStaleTime = 5000 * 60 * 1000; // 5 minutes

export const accountCacheKey = "account_cache";

export type CachedAccount = {
  data: AccountResponse;
  createdAt: number;
};

export function CacheAccount(response: AccountResponse): CachedAccount {
  return {
    data: response,
    createdAt: Date.now(),
  };
}
