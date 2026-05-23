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
  featured?: boolean;
}

export const BillingBlock: React.FC<Props> = ({ featured, ...props }) => {
  return (
    <div
      className={cn(
        'relative flex flex-col p-7 gap-5 h-full transition-all duration-200',
        featured ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white' : 'bg-white text-slate-900',
        props.className,
      )}>
      {/* Header */}
      <div className='space-y-1'>
        <h2 className={cn('text-lg font-semibold tracking-tight', featured ? 'text-white' : 'text-slate-900')}>{props.title}</h2>
        <p className={cn('text-xs leading-relaxed', featured ? 'text-slate-400' : 'text-slate-400')}>{props.description}</p>
      </div>

      {/* Banner */}
      {props.banner && <div>{props.banner}</div>}

      {/* CTA */}
      <div className='w-full'>{props.actionButton}</div>

      {/* Benefits */}
      <div className='flex-1'>
        <p className={cn('text-xs font-semibold uppercase tracking-widest mb-3', featured ? 'text-slate-400' : 'text-slate-400')}>
          {props.benefitsTitle}
        </p>
        <ul className='space-y-2.5'>
          {props.benefits.map((item, i) => (
            <li
              key={`bb_${i}`}
              className='flex items-start gap-2.5 text-sm'>
              <span
                className={cn(
                  'mt-0.5 flex-shrink-0 size-4 rounded-full flex items-center justify-center',
                  item.active
                    ? featured
                      ? 'bg-emerald-400/20 text-emerald-400'
                      : 'bg-emerald-50 text-emerald-500'
                    : featured
                      ? 'bg-slate-700 text-slate-500'
                      : 'bg-slate-100 text-slate-400',
                )}>
                <Check
                  className='size-2.5'
                  strokeWidth={3}
                />
              </span>
              <span
                className={cn(
                  item.active ? (featured ? 'text-slate-200' : 'text-slate-700') : featured ? 'text-slate-500' : 'text-slate-400',
                )}>
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
