/** biome-ignore-all lint/suspicious/noArrayIndexKey: BillingBlock */
'use client';

import { Check } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

interface BenefitProps {
  title: string;
  active?: boolean;
}

interface Props {
  title: string;
  description: string;
  actionButton: React.ReactNode;
  banner: React.ReactNode;
  benefitsTitle: string;
  benefits: BenefitProps[];
  className?: string;
}

export const BillingLargeBlock: React.FC<Props> = ({ ...props }) => {
  return (
    <div className={cn('bg-white grid grid-rows-[4rem_auto_1fr_0fr_2fr] size-full p-6 gap-4 h-full', props.className)}>
      <div>
        <h1 className='text-3xl font-semibold font-nunito-sans'>{props.title}</h1>
        <p className='text-neutral-400 text-sm'>{props.description}</p>
      </div>
      <div className='flex items-end font-semibold font-nunito-sans gap-2 w-fit'>
        <h1 className='text-4xl text-red-600 relative'>
          90${' '}
          <span className='absolute top-0 right-0 translate-x-full -translate-y-3 bg-red-600/60 text-[12px] rounded text-white px-1 py-0.5'>
            -10%
          </span>
        </h1>
        <p className='line-through text-neutral-400'>130$</p>
        <p className='font-semibold text-xl'>/ month</p>
      </div>
      <div className='mt-auto'>{props.banner}</div>
      <div className='w-full flex *:w-full'>{props.actionButton}</div>
      <div>
        <p className='font-medium text-sm'>{props.benefitsTitle}</p>
        <ul className='mt-2 flex flex-col gap-2'>
          {props.benefits.map((item, i) => (
            <li
              key={`bb_${i}`}
              className='text-sm gap-1 grid items-center grid-cols-[20px_auto]'>
              <Check className={cn('size-4', item.active && 'text-emerald-500')} />
              <p className=''>{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
