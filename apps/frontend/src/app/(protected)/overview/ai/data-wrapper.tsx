'use client';

import { usePresets } from '@/api/hooks/usePresets.hook';
import AllAiModels from '@/components/protected/ai/all-ai-models';
import AvailableAiModels from '@/components/protected/ai/available-ai-models';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiDataWrapper() {
  const { data: presets, isLoading } = usePresets();

  if (isLoading) {
    return (
      <div className='grid gap-20'>
        <div className='grid grid-cols-3 gap-5 items-start max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
          <Skeleton className='w-full h-40 rounded-md' />
          <Skeleton className='w-full h-40 rounded-md' />
          <Skeleton className='w-full h-40 rounded-md' />
        </div>
        <div className='grid grid-cols-3 gap-5 items-start max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
          <Skeleton className='w-full h-40 rounded-md' />
          <Skeleton className='w-full h-40 rounded-md' />
          <Skeleton className='w-full h-40 rounded-md' />
        </div>
      </div>
    );
  }

  return (
    <div className='grid gap-20'>
      {presets?.available && <AvailableAiModels availableModels={presets.available} />}
      {presets?.notOwned && <AllAiModels models={presets.notOwned} />}
    </div>
  );
}
