import { useQuery } from "@tanstack/react-query";
import {
  fiveMinutes,
  presetsCacheKey,
  RemoveCache,
  SetCache,
} from "@/lib/cache";
import type { AiPresetResponse, AiPresetsResponse } from "../generated";
import { fetchModels } from "../requests/ai.req";

export interface PresetsData {
  available: AiPresetResponse[];
  notOwned: AiPresetResponse[];
}

export const usePresets = () => {
  return useQuery({
    queryKey: ["presets"],
    queryFn: async (): Promise<AiPresetsResponse> => {
      const rawCache = localStorage.getItem(presetsCacheKey);

      if (rawCache) {
        const cacheObject = JSON.parse(rawCache) as {
          data: AiPresetsResponse;
          createdAt: number;
        };
        const age = Date.now() - cacheObject.createdAt;

        if (age <= fiveMinutes) {
          return cacheObject.data;
        } else {
          RemoveCache(presetsCacheKey);
        }
      }

      const data = (await fetchModels()) as AiPresetsResponse;
      SetCache(presetsCacheKey, data);

      return data;
    },
    staleTime: fiveMinutes,
    select: (data) => {
      const ownedSet = new Set(data.ownedPresetIds);
      return {
        available: data.presets.filter((p) => ownedSet.has(p.id)),
        notOwned: data.presets.filter((p) => !ownedSet.has(p.id)),
      } as PresetsData;
    },
  });
};
