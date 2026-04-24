'use client';

import type { ResumeResponse } from '@/api/snapshots/resumes/resume.types';
import { cn } from '@/lib/utils';

export default function UploadedResumeInProgressCard() {
  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all outline hover:outline-primary group h-auto overflow-hidden',
        false && 'outline-emerald-500 bg-emerald-500/5',
      )}>
      <div className='w-full flex justify-between items-center max-sm:flex-col max-sm:items-start'>
        <h2 className='text-2xl font-semibold'>hh</h2>
        <div>
          <p className='font-nunito-sans font-bold text-end max-sm:hidden'>hh</p>
        </div>
      </div>

      <div className='flex flex-col mt-3'>
        <p className={cn('text-sm text-neutral-600 text-balance')}>gfg</p>
      </div>
    </div>
  );
}
