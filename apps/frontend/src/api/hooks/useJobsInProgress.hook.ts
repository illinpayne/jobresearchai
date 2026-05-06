import { useQuery } from "@tanstack/react-query";
import {
  jobsCacheKey,
  jobsCacheStaleTime,
  RemoveCache,
  SetCache,
} from "@/lib/cache";
import type { SimplifiedAnalyseJobWithPresetResponse } from "../generated";
import { getJobsInProgress } from "../requests/ai.req";

export const useJobsInProgress = () => {
  return useQuery({
    queryKey: ["jobsInProgress"],
    queryFn: async (): Promise<SimplifiedAnalyseJobWithPresetResponse> => {
      const rawCache = localStorage.getItem(jobsCacheKey);

      if (rawCache) {
        const cacheObject = JSON.parse(rawCache) as {
          data: SimplifiedAnalyseJobWithPresetResponse;
          createdAt: number;
        };
        const age = Date.now() - cacheObject.createdAt;

        if (age <= jobsCacheStaleTime) {
          if (typeof cacheObject.data === "string") {
            return {
              jobs: [],
            };
          }
          return cacheObject.data;
        } else {
          RemoveCache(jobsCacheKey);
        }
      }

      try {
        const data =
          (await getJobsInProgress()) as SimplifiedAnalyseJobWithPresetResponse;

        if (data.jobs.length > 0) {
          SetCache(jobsCacheKey, data);
        }

        return data;
      } catch (error) {
        SetCache(jobsCacheKey, "not-found");
      }

      return {
        jobs: [],
      };
    },
    retry: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
