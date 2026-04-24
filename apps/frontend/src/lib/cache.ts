import type { AccountResponse } from '@/api/generated';

const fiveMinutes = 5 * 60 * 1000;
const twoMinutes = 2 * 60 * 1000;

export const accountCacheStaleTime = fiveMinutes;
export const changePasswordCacheStaleTime = twoMinutes;

export const accountCacheKey = 'account_cache';
export const changePasswordCacheKey = 'change_password_cache';
export const changeEmailCacheKey = 'change_email_cache';

export type BaseCache = {
  createdAt: number;
};

export type CachedAccount = BaseCache & {
  data: AccountResponse;
};

export type PasswordChangeCache = BaseCache;
export type EmailChangeCache = BaseCache;

export function CacheAccount(response: AccountResponse): CachedAccount {
  return {
    data: response,
    createdAt: Date.now(),
  };
}

export function GetPasswordChangeCache(): PasswordChangeCache | null {
  const cache = localStorage.getItem(changePasswordCacheKey);
  if (cache) {
    return {
      createdAt: JSON.parse(cache).createdAt as number,
    };
  }
  return null;
}

export function SetPasswordChangeCache(): PasswordChangeCache {
  const newCache: PasswordChangeCache = {
    createdAt: Date.now(),
  };
  localStorage.setItem(changePasswordCacheKey, JSON.stringify(newCache));
  return newCache;
}

export function GetEmailChangeCache(): EmailChangeCache | null {
  const cache = localStorage.getItem(changeEmailCacheKey);
  if (cache) {
    return {
      createdAt: JSON.parse(cache).createdAt as number,
    };
  }
  return null;
}

export function SetEmailChangeCache(): EmailChangeCache {
  const newCache: EmailChangeCache = {
    createdAt: Date.now(),
  };
  localStorage.setItem(changeEmailCacheKey, JSON.stringify(newCache));
  return newCache;
}

export function DisposeCache(key: string) {
  localStorage.removeItem(key);
}

export function isCacheExpired(createdAt: number) {
  const age = Date.now() - createdAt;
  if (age > accountCacheStaleTime) return true;
  return false;
}
