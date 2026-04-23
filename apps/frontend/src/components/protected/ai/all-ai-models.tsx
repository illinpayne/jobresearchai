'use client';

import type { AiModelResponse } from '@/api/snapshots/ai/ai.dto';
import AiModelCard from '@/components/shared/ai-model-card';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';

interface Props {
  models: AiModelResponse[];
}

export default function AllAiModels({ ...props }: Props) {
  const billing = useBillingDialog();

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
            billing={f.billing}
            stars={f.stars}
            id={f.id}
            usage={f.usage}
            onAdd={(model) => {
              if (model.billing.toLowerCase() !== 'free') {
                billing.onOpen();
                return;
              }
              console.log(model);
            }}
          />
        ))}
      </div>
    </div>
  );
}
