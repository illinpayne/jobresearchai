'use client';

import { allModels } from '@/api/snapshots/ai/mock.data';
import AiModelCard from '@/components/shared/ai-model-card';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';

export default function AllAiModels() {
  const billing = useBillingDialog();
  return (
    <div className='grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
      {allModels.map((f) => (
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
  );
}
