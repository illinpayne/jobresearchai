import { useQuery } from "@tanstack/react-query";
import {
  billingSubscriptionCacheKey,
  billingSubscriptionCacheStaleTime,
  RemoveCache,
  SetCache,
} from "@/lib/cache";
import type { AiPresetResponse, SubscriptionModelResponse } from "../generated";
import { getSubscription } from "../requests/billing.req";

export interface PresetsData {
  available: AiPresetResponse[];
  notOwned: AiPresetResponse[];
}

export const useCurrentSubscription = (enabled?: boolean) => {
  return useQuery({
    queryKey: ["billing-subscription"],
    queryFn: async (): Promise<SubscriptionModelResponse> => {
      const rawCache = localStorage.getItem(billingSubscriptionCacheKey);

      if (rawCache) {
        const cacheObject = JSON.parse(rawCache) as {
          data: SubscriptionModelResponse;
          createdAt: number;
        };
        const age = Date.now() - cacheObject.createdAt;

        if (age <= billingSubscriptionCacheStaleTime) {
          return cacheObject.data;
        } else {
          RemoveCache(billingSubscriptionCacheKey);
        }
      }

      const data = await getSubscription();
      SetCache(billingSubscriptionCacheKey, data);
      return data;
    },
    staleTime: billingSubscriptionCacheStaleTime,
    retry: 0,
    enabled: enabled,
  });
};
