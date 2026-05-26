'use client';

import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook';
import { Button } from '@/components/ui/button';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';

export default function SubscriptionBanner() {
  const { onOpen } = useBillingDialog();
  const { data: sub } = useCurrentSubscription();

  if (sub && sub.plan.name !== 'Free') {
    return <></>;
  }

  return (
    <div className='rounded-sm bg-linear-90 from-primary to-blue-900 p-6 grid grid-cols-3 relative'>
      {/* <div className='absolute top-2 left-4 bg-white/20 rounded size-4'></div> */}
      <div className='absolute top-4 right-44 bg-white/20 rounded size-4'></div>
      <div className='absolute top-4 right-39 bg-white/20 rounded size-4'></div>
      <div className='absolute top-9 right-40 bg-white/20 rounded size-4'></div>
      <div className='absolute top-9 right-35 bg-white/20 rounded size-4'></div>
      <div className='absolute top-14 right-43 bg-white/20 rounded size-4'></div>
      <div className='absolute top-14 right-38 bg-white/20 rounded size-4'></div>
      <div className='col-span-2'>
        <h1 className='text-white font-semibold text-xl'>Buy subscription</h1>
        <p className='text-neutral-300'>Unlock unlimited AI processing, find job x10 faster</p>
      </div>
      <Button
        className='ml-auto my-auto bg-blue-600'
        onClick={onOpen}>
        See billing
      </Button>
    </div>
  );
}
