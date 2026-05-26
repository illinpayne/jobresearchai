import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  billingSubscriptionCacheKey,
  billingSubscriptionCacheStaleTime,
  RemoveCache,
  SetCache,
} from "@/lib/cache";
import { getSessionToken } from "@/lib/cookies";
import type { AiPresetResponse, SubscriptionModelResponse } from "../generated";
import { getSubscription } from "../requests/billing.req";

export interface PresetsData {
  available: AiPresetResponse[];
  notOwned: AiPresetResponse[];
}

export const useCurrentSubscription = (enabled?: boolean) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasToken = !!getSessionToken();

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

      try {
        const data = await getSubscription();
        SetCache(billingSubscriptionCacheKey, data);
        return data;
      } catch (error) {
        SetCache(billingSubscriptionCacheKey, null);
        throw error;
      }
    },
    staleTime: billingSubscriptionCacheStaleTime,
    retry: 0,
    enabled: enabled !== false && isMounted && hasToken,
  });
};
