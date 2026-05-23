import { useQuery } from "@tanstack/react-query";
import {
  bundleCacheKey,
  bundleCacheStaleTime,
  RemoveCache,
  SetCache,
} from "@/lib/cache";
import type { BundlesResponse } from "../generated";
import { getBundles } from "../requests/billing.req";

export const useBillingBundles = () => {
  return useQuery({
    queryKey: ["billing-bundles"],
    queryFn: async (): Promise<BundlesResponse> => {
      const rawCache = localStorage.getItem(bundleCacheKey);

      if (rawCache) {
        const cacheObject = JSON.parse(rawCache) as {
          data: BundlesResponse;
          createdAt: number;
        };
        const age = Date.now() - cacheObject.createdAt;

        if (age <= bundleCacheStaleTime) {
          return cacheObject.data;
        } else {
          RemoveCache(bundleCacheKey);
        }
      }

      const data = await getBundles();
      SetCache(bundleCacheKey, data);
      return data;
    },
    staleTime: bundleCacheStaleTime,
    retry: 0,
  });
};
