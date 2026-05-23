'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBillingBundles } from '@/api/hooks/useBillingBundles.hook';
import { useBuyBundle } from '@/api/hooks/useBuyBundle.hook';
import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook';
import { BundleCard } from '@/components/shared/bundle-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BundleWrapper() {
  const [mounted, setMounted] = useState(false);
  const { data: bundles } = useBillingBundles();
  const { data: sub } = useCurrentSubscription();
  const { mutateAsync: buyBundleAsync } = useBuyBundle({
    onSuccess(data) {
      const { url } = data;
      router.push(url);
    },
  });

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !sub || !bundles) {
    return (
      <div className='flex items-center justify-center gap-20'>
        <div className='grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
          <Skeleton className='w-[20vw] h-[30vh] rounded-md' />
          <Skeleton className='w-[20vw] h-[30vh] rounded-md' />
          <Skeleton className='w-[20vw] h-[30vh] rounded-md' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {bundles.bundles.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            onPaymentAction={async (dto) => {
              await buyBundleAsync(dto);
            }}
          />
        ))}
      </div>
    </div>
  );
}
