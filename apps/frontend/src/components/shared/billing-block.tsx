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

export const BillingBlock: React.FC<Props> = ({ ...props }) => {
  return (
    <div className={cn('bg-white grid grid-rows-[4rem_1fr_0fr_2fr] size-full p-6 gap-4 h-full', props.className)}>
      <div>
        <h1 className='text-xl font-semibold'>{props.title}</h1>
        <p className='text-neutral-400 text-xs'>{props.description}</p>
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
