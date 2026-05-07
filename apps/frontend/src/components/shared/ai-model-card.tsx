'use client';

import { Check, LoaderCircle, Star } from 'lucide-react';
import type { AiPresetResponse } from '@/api/generated';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface Props extends AiPresetResponse {
  isSelected?: boolean;
  isAlreadyAvailable?: boolean;
  isLoading?: boolean;
  onSelect?: (model: AiPresetResponse) => void;
  onAdd?: (model: AiPresetResponse) => void;
}

export default function AiModelCard({ ...props }: Props) {
  return (
    <div className='relative group h-full'>
      {props.isLoading && (
        <div className='size-full absolute top-0 left-0 rounded-lg bg-black/20 backdrop-blur-md z-10 flex items-center justify-center'>
          <div className='animate-spin'>
            <LoaderCircle className='text-blue-500' />
          </div>
        </div>
      )}
      <div
        className={cn(
          'rounded-lg p-4 transition-all outline hover:outline-primary h-full flex flex-col',
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
        <div className='flex flex-col h-full'>
          <div className='flex gap-1'>
            {[...Array(5)].map((f, i) => (
              <Star
                key={i}
                className={cn('size-4', i < props.stars ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-400 fill-neutral-400')}
              />
            ))}
          </div>
          <p className='text-neutral-600 font-nunito-sans my-3'>{props.description}</p>
          <p className='text-neutral-600 text-sm font-nunito-sans mt-auto'>{props.usageCredits ?? 0} tokens per analyse</p>
        </div>
      </div>
      <div className='transition-all duration-300 group-hover:opacity-100 opacity-0 absolute bottom-4 right-4 z-10'>
        <div className='mt-3 flex justify-end gap-2'>
          {!props.isAlreadyAvailable && (
            <Button
              variant={'ghost'}
              className='hover:bg-primary/5 text-blue-500 hover:text-blue-600 transition-all'
              onClick={() => {
                props.onAdd && props.onAdd(props as AiPresetResponse);
              }}>
              Get model
            </Button>
          )}
          {!props.isSelected && props.isAlreadyAvailable && (
            <Button
              variant={'ghost'}
              className='hover:bg-primary/5 text-blue-500 hover:text-blue-600 transition-all'
              disabled={props.isSelected}
              onClick={() => {
                props.onSelect && props.onSelect(props);
              }}>
              Select
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
