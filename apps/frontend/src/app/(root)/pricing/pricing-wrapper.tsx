'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SubscriptionModelResponse } from '@/api/generated';
import { useBillingBundles } from '@/api/hooks/useBillingBundles.hook';
import { useBillingPlans } from '@/api/hooks/useBillingPlans.hook';
import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook';
import { useSubscribe } from '@/api/hooks/useSubscribe.hook';
import { BillingPlanCard } from '@/components/shared/billing-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants';

export default function PricingWrapper() {
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { data: plans } = useBillingPlans();
  const { data: bundles } = useBillingBundles();
  const { data: sub } = useCurrentSubscription();

  const router = useRouter();
  const { mutateAsync: subscribeAsync } = useSubscribe({
    onSuccess(data) {
      const { url } = data;
      router.push(url);
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !sub || !plans) {
    return (
      <div className='flex items-center justify-center gap-20'>
        <div className='grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
          <Skeleton className='w-[20vw] h-[60vh] rounded-md' />
          <Skeleton className='w-[20vw] h-[60vh] rounded-md' />
          <Skeleton className='w-[20vw] h-[60vh] rounded-md' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex justify-center gap-6'>
        <label className='flex items-center cursor-pointer gap-3'>
          <input
            type='radio'
            name='billingCycle'
            value='monthly'
            checked={billingCycle === 'monthly'}
            onChange={() => {
              setBillingCycle('monthly');
            }}
            className='w-4 h-4 accent-blue-600 cursor-pointer'
          />
          <span className='font-medium text-lg text-gray-800'>Monthly</span>
        </label>
        <label className='flex items-center cursor-pointer gap-3'>
          <input
            type='radio'
            name='billingCycle'
            value='annual'
            checked={billingCycle === 'annual'}
            onChange={() => {
              setBillingCycle('annual');
            }}
            className='w-4 h-4 accent-blue-600 cursor-pointer'
          />
          <span className='font-medium text-lg text-gray-800'>Annual</span>
          <span className='text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full'>Save 20%</span>
        </label>
      </div>
      <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {plans?.plans.map((plan) => (
          <BillingPlanCard
            key={plan.id}
            plan={{
              id: plan.id,
              title: plan.name,
              description: plan.description,
              price: billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice,
              cta: plan.trialDays > 0 ? 'free-trial' : 'get-started',
              benefits: plan.benefits,
              featured: plan.name === 'Pro',
              priceWithoutDiscount: billingCycle === 'annual' ? `${plan.monthlyPrice * 12}` : undefined,
            }}
            onPaymentAction={async (dto) => {
              if (!sub || (sub as SubscriptionModelResponse).plan.name === 'Free') {
                await subscribeAsync(dto);
              } else {
                router.push(ROUTES.OVERVIEW.USAGE);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
