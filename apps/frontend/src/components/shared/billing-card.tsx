'use client';

import { Check } from 'lucide-react';
import type { CreateSubscription } from '@/api/generated';
import { cn } from '@/lib/utils';

export type Plan = {
  id: string;
  title: string;
  description: string;
  price: number | 'Free';
  period?: string;
  cta: 'free-trial' | 'get-started';
  featured?: boolean;
  benefits: string[];
  priceWithoutDiscount?: string;
};

interface BillingPlanCardProps {
  plan: Plan;
  className?: string;
  onPaymentAction: (dto: CreateSubscription) => void;
}

export function BillingPlanCard({ plan, className, onPaymentAction }: BillingPlanCardProps) {
  const { title, description, price, period = '/mo', cta, featured, benefits, priceWithoutDiscount } = plan;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border bg-white px-7 py-8 transition-shadow',
        featured ? 'border-blue-500 shadow-blue-100' : 'border-zinc-200 hover:shadow-md',
        className,
      )}>
      {featured && (
        <span className='absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white'>
          Most popular
        </span>
      )}
      <header className='mb-6'>
        <h2 className='text-lg font-semibold text-zinc-900'>{title}</h2>
        <p className='mt-1 text-sm leading-relaxed text-zinc-500 min-h-14'>{description}</p>
      </header>
      <div className='mb-8 flex items-end gap-1'>
        {price === 'Free' ? (
          <span className='text-4xl font-bold tracking-tight text-zinc-900'>Free</span>
        ) : (
          <>
            <span className='text-sm font-medium text-zinc-500 mb-1'>$</span>
            <span className='text-4xl font-bold tracking-tight text-zinc-900 relative'>
              {price}{' '}
              {priceWithoutDiscount && (
                <span className='absolute -right-8 -top-2 text-sm font-medium line-through text-neutral-500'>{priceWithoutDiscount}$</span>
              )}
            </span>
            <span className='mb-1 text-sm text-zinc-400'>{period}</span>
          </>
        )}
      </div>
      <button
        type='button'
        className={cn(
          'mb-8 w-full py-2.5 text-sm font-semibold rounded-sm cursor-pointer transition-colors focus-visible:outline-offset-2',
          featured
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600'
            : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 focus-visible:outline-zinc-400',
        )}
        onClick={() => {
          onPaymentAction({ planId: plan.id, interval: priceWithoutDiscount ? 'ANNUAL' : 'MONTHLY' });
        }}>
        {cta === 'free-trial' ? 'Start free trial' : 'Get started'}
      </button>
      <hr className='mb-6 border-zinc-100' />
      <ul className='flex flex-col gap-3'>
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className='flex items-start gap-3 text-sm text-zinc-600'>
            <span
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                featured ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-500',
              )}>
              <Check
                size={10}
                strokeWidth={3}
                aria-hidden
              />
            </span>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}
