'use client';

import type { SubscriptionModelResponse } from '@/api/generated'
import { useBillingPlans } from '@/api/hooks/useBillingPlans.hook'
import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook'
import { useSubscribe } from '@/api/hooks/useSubscribe.hook'
import { BillingPlanCard } from '@/components/shared/billing-card'
import { buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ApplicationName, ROUTES } from '@/constants'
import { useBillingDialog } from '@/hooks/useBillingDialog.hook'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const BillingModalProvider = () => {
  const { onOpen, onClose, isOpen } = useBillingDialog();
  const { data: plans } = useBillingPlans();
  const { data: sub } = useCurrentSubscription();
  const { mutateAsync: subscribeAsync } = useSubscribe({
    onSuccess(data) {
      const { url } = data;
      router.push(url);
    },
  });
  const [billingCycle] = useState('monthly');
  const router = useRouter();

  return (
    <Dialog
      onOpenChange={onOpen}
      open={isOpen}>
      <DialogContent
        showCloseButton={false}
        className='rounded-lg sm:max-w-max sm:max-h-max pb-2 no-scrollbar max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center gap-2 select-none'>
            <Image
              src={'/images/icon.webp'}
              width={24}
              height={24}
              alt='logo'
            />
            <h1 className='font-medium text-xl'>{ApplicationName}</h1>
            <button
              onClick={onClose}
              className='ml-auto cursor-pointer text-neutral-500 hover:text-blue-700'>
              <X className='size-5' />
            </button>
          </div>
          <DialogTitle className='text-2xl font-inter leading-5 mt-3'>
            Upgrade to elevate your stuff faster with{' '}
            <span className='bg-linear-to-r text-transparent bg-clip-text from-blue-500 to-emerald-500'>AI</span>
          </DialogTitle>
          <DialogDescription>
            By upgrading, you get more attempts to review your resumes, getting vacancies, offers, and more.
          </DialogDescription>
        </DialogHeader>
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-10'>
          {plans?.plans?.map((plan, i) => (
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
        <div className='flex items-center justify-between w-full p-0'>
          <p className='text-sm text-neutral-500'>Cancel anytime. We'll remind you three days before your trial ends.</p>
          <button
            className={cn('px-0', buttonVariants({ variant: 'link' }))}
            onClick={() => {
              onClose();
              router.push(ROUTES.PRICING);
            }}>
            See all features
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
