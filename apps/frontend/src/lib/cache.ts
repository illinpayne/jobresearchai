import type { AccountResponse } from "@/api/generated";

export const fiveMinutes = 5 * 60 * 1000;
export const day = 24 * 60 * 1000;
export const tenMinutes = 10 * 60 * 1000;
export const twoMinutes = 2 * 60 * 1000;
export const fiveSeconds = 5000;

export const accountCacheStaleTime = fiveMinutes;
export const changePasswordCacheStaleTime = twoMinutes;
export const presetsCacheStaleTime = day;
export const profilesCacheStaleTime = tenMinutes;
export const jobsCacheStaleTime = fiveSeconds;
export const jobsFilterCacheStaleTime = fiveSeconds;

export const accountCacheKey = "account_cache";
export const changePasswordCacheKey = "change_password_cache";
export const changeEmailCacheKey = "change_email_cache";
export const aiModelCacheKey = "ai-cache";
export const presetsCacheKey = "presets_data";
export const profilesCacheKey = "profiles_data";
export const jobsCacheKey = "jobs_data";
export const jobsFilterCacheKey = "vacancies_filter_data";

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

export function InvalidateAccountCache(
  response: AccountResponse,
): CachedAccount {
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

export function RemoveCache(key: string) {
  localStorage.removeItem(key);
}

export function DisposeCache() {
  const cache_to_remove = [
    accountCacheKey,
    changePasswordCacheKey,
    changeEmailCacheKey,
    aiModelCacheKey,
    presetsCacheKey,
    jobsCacheKey,
    jobsFilterCacheKey,
  ];
  cache_to_remove.forEach((key) => {
    RemoveCache(key);
  });
}

export function isCacheExpired(createdAt: number) {
  const age = Date.now() - createdAt;
  if (age > accountCacheStaleTime) return true;
  return false;
}

export function SetCache(key: string, value: any) {
  const cacheObject = {
    data: value,
    createdAt: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheObject));
}

export function GetCache<T>(key: string): T | null {
  const cache = localStorage.getItem(key);
  if (cache) {
    const cacheObject = JSON.parse(cache) as { data: T; createdAt: number };
    return cacheObject.data;
  }
  return null;
}
