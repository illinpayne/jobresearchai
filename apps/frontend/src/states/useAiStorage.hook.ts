import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AiPresetResponse } from "@/api/generated";
import { aiModelCacheKey } from "@/lib/cache";

interface AIModelState extends AiPresetResponse {}

interface AIModelActions {
  setModel: (model: AIModelState) => void;
  resetToDefault: () => void;
}

type AIStore = AIModelState & AIModelActions;

const initialState: AIModelState = {
  name: "",
  description: "",
  id: "",
  usageTokens: 0,
  stars: 0,
  paidTier: "free",
  temperature: 0,
};

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      ...initialState,
      setModel: (model) => set(model),
      resetToDefault: () => set(initialState),
    }),
    {
      name: aiModelCacheKey,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
