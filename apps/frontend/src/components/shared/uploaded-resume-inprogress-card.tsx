'use client';

import { Loader, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadedResumeInProgressCard() {
  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all outline hover:outline-primary group h-auto overflow-hidden relative',
        false && 'outline-emerald-500 bg-emerald-500/5',
      )}>
      <div className='w-full flex justify-between items-center max-sm:flex-col max-sm:items-start'>
        <h2 className='text-2xl font-semibold'>CV</h2>
        <div>
          <p className='border px-1 bg-blue-500/5 border-blue-500 text-sm rounded text-blue-600'>In progress</p>
        </div>
      </div>
      <div className='flex gap-3 mt-3'>
        <div className='animate-spin'>
          <LoaderCircle className='size-5' />
        </div>
        <p className={cn('text-sm text-indigo-600 text-balance animate-pulse')}>Defining a structure...</p>
      </div>
      <div className='flex mt-3 items-center gap-5'>
        <p className={cn('text-sm text-neutral-600 text-balance')}>CV.pdf • Junkie Nano 2.0</p>
      </div>
      <div className='absolute bottom-0 right-0 opacity-15'>
        <div className='ai-fluid-container'>
          <div className='ai-orb orb-magenta'></div>
          <div className='ai-orb orb-purple'></div>
          <div className='ai-orb orb-cyan'></div>
        </div>
      </div>
    </div>
  );
}
