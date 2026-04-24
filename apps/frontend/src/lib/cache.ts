import type { AccountResponse } from '@/api/generated';

const fiveMinutes = 5 * 60 * 1000;
const twoMinutes = 2 * 60 * 1000;

export const accountCacheStaleTime = fiveMinutes;
export const changePasswordCacheStaleTime = twoMinutes;

export const accountCacheKey = 'account_cache';
export const changePasswordCacheKey = 'change_password_cache';
export const changeEmailCacheKey = 'change_email_cache';
export const aiModelCacheKey = 'ai-cache';

export type BaseCache = {
  createdAt: number;
};

export type CachedAccount = BaseCache & {
  data: AccountResponse;
};

export type PasswordChangeCache = BaseCache;
export type EmailChangeCache = BaseCache;

export function MakeCacheAccount(response: AccountResponse): CachedAccount {
  return {
    data: response,
    createdAt: Date.now(),
  };
}
export function InvalidateAccountCache(response: AccountResponse): CachedAccount {
  const cache = localStorage.getItem(accountCacheKey);
  let new_cache = null;
  if (!cache) {
    new_cache = {
      data: response,
      createdAt: Date.now(),
    };
  } else {
    const cacheObject = JSON.parse(cache) as CachedAccount;
    new_cache = {
      data: response,
      createdAt: cacheObject.createdAt,
    };
  }

  localStorage.setItem(accountCacheKey, JSON.stringify(new_cache));
  return new_cache;
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
