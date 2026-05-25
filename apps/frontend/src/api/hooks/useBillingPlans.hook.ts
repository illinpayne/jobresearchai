import { useQuery } from '@tanstack/react-query';
import { plansCacheKey, plansCacheStaleTime, RemoveCache, SetCache } from '@/lib/cache';
import type { PlansResponse } from '../generated';
import { getPlans } from '../requests/billing.req';

export const useBillingPlans = () => {
  return useQuery({
    queryKey: ['billing-plans'],
    queryFn: async (): Promise<PlansResponse> => {
      const rawCache = localStorage.getItem(plansCacheKey);

      if (rawCache) {
        const cacheObject = JSON.parse(rawCache) as {
          data: any;
          createdAt: number;
        };
        const age = Date.now() - cacheObject.createdAt;

        if (age <= plansCacheStaleTime) {
          return cacheObject.data;
        } else {
          RemoveCache(plansCacheKey);
        }
      }

      const data = await getPlans();
      SetCache(plansCacheKey, data);
      return data;
    },
    staleTime: plansCacheStaleTime,
    retry: 0,
  });
};
