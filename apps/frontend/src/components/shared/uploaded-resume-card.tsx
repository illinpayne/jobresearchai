'use client';

import type { ResumeResponse } from '@/api/snapshots/resumes/resume.types';
import { cn } from '@/lib/utils';

interface Props extends ResumeResponse {}

export default function UploadedResumeCard({ ...props }: Props) {
  const getResumeFeedback = (score: number): string => {
    if (score <= 30) {
      return 'Resume score is critically low. AI models will likely skip this profile. Major content and keyword updates required.';
    }

    if (score <= 60) {
      return 'Profile is under-optimized. You need more specific technical metrics and production-level project details to land offers.';
    }

    if (score <= 90) {
      return 'Your resume is strong and well-structured for modern hiring pipelines.';
    }

    return 'Excellent! This resume is highly optimized for maximum offer conversion.';
  };

  const getResumeColor = (score: number): string => {
    if (score <= 30) {
      return `bg-red-500`;
    }

    if (score <= 60) {
      return `bg-amber-400`;
    }

    if (score <= 90) {
      return `bg-emerald-500`;
    }

    return `bg-primary`;
  };

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all outline hover:outline-primary group h-auto overflow-hidden h-fit group',
        false && 'outline-emerald-500 bg-emerald-500/5',
      )}>
      <div className='w-full flex justify-between items-center max-sm:flex-col max-sm:items-start'>
        <h2 className='text-2xl font-semibold'>{props.position}</h2>
        <div>
          <p className='font-nunito-sans font-bold text-end max-sm:hidden'>{props.rating}/100</p>
          <div className='flex'>
            <div
              className={cn('h-1 rounded', getResumeColor(props.rating))}
              style={{ width: props.rating }}></div>
            <div
              className='h-1 bg-neutral-300 rounded-r'
              style={{ width: 100 - props.rating }}></div>
          </div>
        </div>
      </div>
      <div className='flex gap-1 items-center text-sm text-neutral-600'>
        <p className=''>{props.yearsOld} y.o, </p>
        <p>{props.location}</p>
      </div>
      <div className='flex flex-col divide-y mt-3 *:py-1'>
        {props.specifications.map((f, i) => (
          <div
            key={i}
            className='grid grid-cols-2 gap-5 max-xl:grid-cols-1 max-xl:gap-0 max-xl:my-1'>
            <p className='text-xl font-medium capitalize'>{f.key}</p>
            <p className='line-clamp-2'>{f.value}</p>
          </div>
        ))}
      </div>
      <div className='flex flex-col mt-3'>
        <p className={cn('text-sm text-neutral-600 text-balance')}>{getResumeFeedback(props.rating)}</p>
      </div>
      <div className='flex justify-end h-0 overflow-hidden group-hover:h-7 transition-all duration-300'>
        <p className={cn('text-xs text-neutral-600 text-balance mt-3')}>
          {props.usedAiModel}, {props.spentTokens} tokens spent
        </p>
      </div>
    </div>
  );
}
