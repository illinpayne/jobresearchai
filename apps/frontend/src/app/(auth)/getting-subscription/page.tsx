'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook';
import { billingSubscriptionCacheKey, RemoveCache } from '@/lib/cache';

export default function GettingSubscription() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { refetch } = useCurrentSubscription(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      RemoveCache(billingSubscriptionCacheKey);
      await setTimeout(async () => {
        await refetch();
      }, 1000);
      router.replace('/overview');
    };
    if (mounted) {
      initializeAuth();
    }
  }, [refetch, router, mounted]);

  if (!mounted) {
    <div className='h-screen flex justify-center items-center bg-white-200'>
      <div className='mx-auto flex flex-col items-center gap-4'>
        <p>Getting the subscription data, please wait...</p>
      </div>
    </div>;
  }

  return (
    <div className='h-screen flex justify-center items-center bg-white-200'>
      <div className='mx-auto flex flex-col items-center gap-4'>
        <p>Getting the subscription data, please wait...</p>
      </div>
    </div>
  );
}
