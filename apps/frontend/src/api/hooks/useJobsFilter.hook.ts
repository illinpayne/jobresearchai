import { useQuery } from '@tanstack/react-query';
import { jobsFilterCacheKey, jobsFilterCacheStaleTime, RemoveCache, SetCache } from '@/lib/cache';
import type { JobFilterDtoResponse } from '../generated';
import { getJobFilter } from '../requests/job.req';

export const useJobsFilter = () => {
  return useQuery({
    queryKey: ['jobs-filter'],
    queryFn: async (): Promise<JobFilterDtoResponse> => {
      const rawCache = localStorage.getItem(jobsFilterCacheKey);

      if (rawCache) {
        const cacheObject = JSON.parse(rawCache) as {
          data: JobFilterDtoResponse;
          createdAt: number;
        };
        const age = Date.now() - cacheObject.createdAt;

        if (age <= jobsFilterCacheStaleTime) {
          if (typeof cacheObject.data === 'string' || !Object.keys(cacheObject.data).includes('positions')) {
            return {
              positions: [],
              locations: [],
              services: [],
              salaryFrom: 0,
              salaryTo: 100000,
            };
          }
          return cacheObject.data;
        } else {
          RemoveCache(jobsFilterCacheKey);
        }
      }

      try {
        const data = (await getJobFilter()) as JobFilterDtoResponse;
        SetCache(jobsFilterCacheKey, data);
        return data;
      } catch (error) {
        SetCache(jobsFilterCacheKey, 'not-found');
      }

      return {
        positions: [],
        locations: [],
        services: [],
        salaryFrom: 0,
        salaryTo: 100000,
      };
    },
    retry: 0,
  });
};
