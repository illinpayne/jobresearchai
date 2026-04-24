import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AiModelResponse } from '@/api/snapshots/ai/ai.dto';
import { aiModelCacheKey } from '@/lib/cache';

interface AIModelState extends AiModelResponse {}

interface AIModelActions {
  setModel: (model: AIModelState) => void;
  resetToDefault: () => void;
}

type AIStore = AIModelState & AIModelActions;

const initialState: AIModelState = {
  name: '',
  description: '',
  id: '',
  usage: 0,
  stars: 0,
  billing: '',
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
