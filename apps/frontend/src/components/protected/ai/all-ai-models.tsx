'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { AiPresetResponse } from '@/api/generated';
import { useGetModel } from '@/api/hooks/useGetModel.hook';
import AiModelCard from '@/components/shared/ai-model-card';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';
import { presetsCacheKey, RemoveCache } from '@/lib/cache';

interface Props {
  models: AiPresetResponse[];
}

export default function AllAiModels({ ...props }: Props) {
  const billing = useBillingDialog();
  const queryClient = useQueryClient();
  const {
    mutateAsync: getModelAsync,
    isPending: isAddingModel,
    variables: model,
  } = useGetModel({
    onSuccess: async (data, variables) => {
      RemoveCache(presetsCacheKey);
      queryClient.invalidateQueries({ queryKey: ['presets'] });
      const { toast } = await import('sonner');
      toast.success(`Model ${variables.name} added to your library`);
    },
  });

  if (!props.models || props.models.length === 0) {
    return <></>;
  }
  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-2xl font-semibold'>Other models</h2>

      <div className='grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
        {props.models.map((f) => (
          <AiModelCard
            key={f.id}
            name={f.name}
            description={f.description}
            paidTier={f.paidTier}
            stars={f.stars}
            id={f.id}
            isLoading={isAddingModel && model?.id === f.id}
            usageTokens={f.usageTokens}
            onAdd={async (model) => {
              // if (model.paidTier.toLowerCase() !== 'free') {
              //   billing.onOpen();
              //   return;
              // }
              await getModelAsync(model);
            }}
            temperature={f.temperature}
          />
        ))}
      </div>
    </div>
  );
}
