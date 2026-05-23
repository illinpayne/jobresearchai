'use client';

import { Check } from 'lucide-react';
import type { BundleModelResponse, BuyBundleDto, CreateSubscription } from '@/api/generated';
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

interface BundleCardProps {
  bundle: BundleModelResponse;
  featured?: boolean;
  className?: string;
  onPaymentAction: (dto: BuyBundleDto) => void;
}

export function BundleCard({ bundle, featured, className, onPaymentAction }: BundleCardProps) {
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
        <h2 className='text-lg font-semibold text-zinc-900'>{bundle.name}</h2>
        <p className='mt-1 text-sm leading-relaxed text-zinc-500 min-h-14'>{bundle.description}</p>
      </header>
      <div className='mb-8 flex items-end gap-1'>
        <span className='text-sm font-medium text-zinc-500 mb-1'>$</span>
        <span className='text-4xl font-bold tracking-tight text-zinc-900 relative'>{bundle.price}</span>
        <span className='mb-1 text-sm text-zinc-400'>for {bundle.credits} credits</span>
      </div>
      <button
        type='button'
        className={cn(
          'w-full py-2.5 text-sm font-semibold rounded-sm cursor-pointer transition-colors focus-visible:outline-offset-2',
          featured
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600'
            : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 focus-visible:outline-zinc-400',
        )}
        onClick={() => {
          onPaymentAction({ bundleId: bundle.id });
        }}>
        Buy
      </button>
    </div>
  );
}
