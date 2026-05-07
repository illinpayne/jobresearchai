import { useQuery } from '@tanstack/react-query';
import { profilesCacheKey, profilesCacheStaleTime, RemoveCache, SetCache } from '@/lib/cache';
import type { AccountProfilesResponse } from '../generated';
import { getAccountProfiles } from '../requests/resume.req';

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async (): Promise<AccountProfilesResponse> => {
      const rawCache = localStorage.getItem(profilesCacheKey);

      if (rawCache) {
        const cacheObject = JSON.parse(rawCache) as {
          data: AccountProfilesResponse;
          createdAt: number;
        };
        const age = Date.now() - cacheObject.createdAt;

        if (age <= profilesCacheStaleTime) {
          if (typeof cacheObject.data === 'string') {
            return {
              data: [],
            };
          }
          return cacheObject.data;
        } else {
          RemoveCache(profilesCacheKey);
        }
      }

      try {
        const data = (await getAccountProfiles()) as AccountProfilesResponse;

        if (data.data.length > 0) {
          SetCache(profilesCacheKey, data);
        }

        return data;
      } catch (error) {
        SetCache(profilesCacheKey, 'not-found');
      }

      return {
        data: [],
      };
    },
    retry: 0,
  });
};
