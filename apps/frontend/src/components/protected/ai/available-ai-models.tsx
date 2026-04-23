'use client';

import type { AiModelResponse } from '@/api/snapshots/ai/ai.dto';
import AiModelCard from '@/components/shared/ai-model-card';
import { useAIStore } from '@/states/useAiStorage.hook';

interface Props {
  availableModels: AiModelResponse[];
  hideTitle?: boolean;
}

export default function AvailableAiModels({ ...props }: Props) {
  const aiStorage = useAIStore();

  if (!props.availableModels || props.availableModels.length === 0) {
    return (
      <div>
        <h1 className='text-2xl font-semibold'>Get your first model for free</h1>
        <p className='font-nunito-sans font-medium text-neutral-600 mt-2'>Explore all the models, decide which one is the best for you!</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {!props.hideTitle && <h2 className='text-2xl font-semibold'>Available models</h2>}
      <div className='grid grid-cols-3 gap-5 items-start max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
        {props.availableModels.map((f) => (
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
