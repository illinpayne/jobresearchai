'use client';

import { Brain } from 'lucide-react';
import type { ExtendedCustomerProfileDto } from '@/api/generated';
import { cn } from '@/lib/utils';

interface Props extends ExtendedCustomerProfileDto {}

export default function UploadedResumeCard({ ...props }: Props) {
  const { profile, spentCredits, presetName } = props;
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
        'rounded-lg p-4 transition-all outline hover:outline-primary group overflow-hidden h-fit group',
        false && 'outline-emerald-500 bg-emerald-500/5',
      )}>
      <div className='w-full flex justify-between items-center max-sm:flex-col max-sm:items-start'>
        <h2 className='text-2xl font-semibold'>
          {profile.currentPosition === 'Not specified' || profile.currentPosition.includes('N/A') || profile.currentPosition === '' ? (
            <span className='flex gap-1'>
              {profile.predicatedPosition} <Brain className='size-4 text-emerald-500' />
            </span>
          ) : (
            profile.currentPosition
          )}
        </h2>
        <div>
          <p className='font-nunito-sans font-bold text-end max-sm:hidden'>{profile.resumeScore}/100</p>
          <div className='flex'>
            <div
              className={cn('h-1 rounded', getResumeColor(profile.resumeScore))}
              style={{ width: profile.resumeScore }}></div>
            <div
              className='h-1 bg-neutral-300 rounded-r'
              style={{ width: 100 - profile.resumeScore }}></div>
          </div>
        </div>
      </div>
      <div className='flex gap-1 items-center text-sm text-neutral-600'>
        <span className='capitalize'>
          {profile.firstName.toLocaleLowerCase()} {profile.lastName.toLocaleLowerCase()} •
        </span>
        {profile.yearsOld > 0 && <p className=''>{profile.yearsOld} y.o • </p>}
        <p>{profile.location}</p>
      </div>
      <div className='flex flex-col divide-y mt-3 *:py-1 *:items-center'>
        <div className='grid grid-cols-2 gap-5 max-xl:grid-cols-1 max-xl:gap-0 max-xl:my-1'>
          <p className='text-xl font-medium capitalize'>Predicted position</p>
          <p className='line-clamp-2'>{profile.predicatedPosition}</p>
        </div>
        <div className='grid grid-cols-2 gap-5 max-xl:grid-cols-1 max-xl:gap-0 max-xl:my-1'>
          <p className='text-xl font-medium capitalize'>Grade</p>
          <p className='line-clamp-2'>{profile.level}</p>
        </div>
        <div className='grid grid-cols-2 gap-5 max-xl:grid-cols-1 max-xl:gap-0 max-xl:my-1'>
          <p className='text-xl font-medium capitalize'>Expected salary</p>
          <p className='line-clamp-2'>
            {profile.expectedSalaryFrom?.toLocaleString('en-US').replace(',', ' ')} -{' '}
            {profile.expectedSalaryTo?.toLocaleString('en-US').replace(',', ' ')} ₴
          </p>
        </div>
        <div className='grid grid-cols-1 gap-2 max-xl:grid-cols-1 max-xl:gap-0 max-xl:my-1'>
          <p className='text-xl font-medium capitalize'>Achivements [{profile.achivements?.length}]</p>
          <ul className='flex flex-col gap-1 list-disc ml-5'>
            {profile?.achivements?.map((f, i) => (
              <li
                key={i}
                className='text-sm'>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className='grid grid-cols-1 gap-2 max-xl:grid-cols-1 max-xl:gap-0 max-xl:my-1'>
          <p className='text-xl font-medium capitalize'>Summary</p>
          <p className='text-sm text-neutral-600'>{profile.summary}</p>
        </div>
        <div className='grid grid-cols-1 gap-2 max-xl:grid-cols-1 max-xl:gap-0 max-xl:my-1'>
          <p className='text-xl font-medium capitalize'>Key points & skills [{profile?.tags?.length}]</p>
          <div className='text-sm flex gap-2 flex-wrap'>
            {profile?.tags?.map((f, i) => (
              <p
                key={i}
                className='text-sm bg-blue-500/10 text-blue-600 rounded px-1 whitespace-nowrap'>
                {f}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className='flex flex-col mt-3'>
        <p className={cn('text-sm text-neutral-600 text-balance')}>{getResumeFeedback(profile.resumeScore)}</p>
      </div>
      <div className='flex justify-end h-0 overflow-hidden group-hover:h-7 transition-all duration-300'>
        <p className={cn('text-xs text-neutral-600 text-balance mt-3')}>
          {presetName}, {spentCredits} credits spent
        </p>
      </div>
    </div>
  );
}
