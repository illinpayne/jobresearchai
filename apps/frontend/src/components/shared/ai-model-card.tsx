'use client';

import { Check, Star } from 'lucide-react';
import type { AiPresetResponse } from '@/api/generated';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface Props extends AiPresetResponse {
  isSelected?: boolean;
  isAlreadyAvailable?: boolean;
  onSelect?: (model: AiPresetResponse) => void;
  onAdd?: (model: AiPresetResponse) => void;
}

export default function AiModelCard({ ...props }: Props) {
  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all outline hover:outline-primary group h-max overflow-hidden',
        props.isSelected && 'outline-emerald-500 bg-emerald-500/5',
      )}>
      <div className='w-full flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>{props.name}</h2>
        {props.isSelected ? (
          <p>
            <span className='text-xs mr-3 max-md:hidden'>Currently used</span>
            <Check className='size-6 text-emerald-500 inline' />
          </p>
        ) : (
          !props.isAlreadyAvailable && (
            <div className='text-sm border border-primary rounded px-2 bg-primary/5 text-primary capitalize max-md:mb-3'>
              {props.paidTier}
            </div>
          )
        )}
      </div>
      <div className='flex flex-col'>
        <div className='flex gap-1'>
          {[...Array(5)].map((f, i) => (
            <Star
              key={i}
              className={cn('size-4', i < props.stars ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-400 fill-neutral-400')}
            />
          ))}
        </div>
        <p className='text-neutral-600 font-nunito-sans mt-3'>{props.description}</p>
        <p className='text-neutral-600 text-sm font-nunito-sans mt-3'>{props.usageTokens ?? 0} tokens per analyse</p>
        {!props.isSelected && (
          <div className='transition-all duration-400 group-hover:h-12 group-hover:opacity-100 h-0 opacity-0'>
            <div className='mt-3 flex justify-end gap-2'>
              {!props.isAlreadyAvailable && (
                <Button
                  onClick={() => {
                    props.onAdd && props.onAdd(props as AiPresetResponse);
                  }}>
                  Get model
                </Button>
              )}
              {!props.isSelected && props.isAlreadyAvailable && (
                <Button
                  variant={'outline'}
                  className='border-primary hover:bg-primary/5'
                  disabled={props.isSelected}
                  onClick={() => {
                    props.onSelect && props.onSelect(props);
                  }}>
                  Select
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
