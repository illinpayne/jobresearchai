'use client';

import { availableModels } from '@/api/snapshots/ai/mock.data';
import AiModelCard from '@/components/shared/ai-model-card';
import { useAIStore } from '@/states/useAiStorage.hook';

export default function AvailableAiModels() {
  const aiStorage = useAIStore();
  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-2xl font-semibold'>Available models</h2>
      <div className='grid grid-cols-3 gap-5 items-start max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
        {availableModels.map((f) => (
          <AiModelCard
            key={f.id}
            id={f.id}
            name={f.name}
            description={f.description}
            usage={f.usage}
            stars={f.stars}
            billing={f.billing}
            isSelected={f.id === aiStorage.id}
            isAlreadyAvailable
            onSelect={() => aiStorage.setModel(f)}
          />
        ))}
      </div>
    </div>
  );
}
