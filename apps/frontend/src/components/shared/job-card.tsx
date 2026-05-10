'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { JobResponse } from '@/api/generated';
import { cn } from '@/lib/utils';

export default function JobCard({ ...props }: JobResponse) {
  function renderImageOfSourceUrl(url: string) {
    if (url.includes('work.ua')) {
      return (
        <div className='flex items-start max-sm:hidden'>
          <Image
            src='https://play-lh.googleusercontent.com/GmN3lG4OjWLcBqj8KY57jzaiUwxsNEwnwccNZ8KxkfWvRKFiP5SFjYxBC___3UuowtQ'
            alt='source-workua'
            className='rounded-sm aspect-square object-cover'
            width={70}
            height={70}
          />
        </div>
      );
    }
    return undefined;
  }

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all outline hover:outline-primary group h-auto overflow-hidden',
        false && 'outline-emerald-500 bg-emerald-500/5 hover:bg-emerald-700/15 hover:outline-emerald-700',
        // props.tags?.includes('hot') && 'bg-linear-to-br from-white to-abmer-500',
      )}>
      <div className='grid grid-cols-[1fr_auto] max-sm:grid-cols-1'>
        <div>
          <div className='w-full flex justify-between items-center gap-5'>
            <Link
              href={props.sourceUrl}
              target='_blank'
              className='text-2xl font-semibold leading-7 hover:text-blue-500'>
              {props.title}
            </Link>
          </div>
          <p className='mt-1 font-semibold underline underline-offset-4 text-blue-800'>{props.company}</p>
          <div className='grid gap-1 items-center'>
            {props.salary && <p className='font-nunito-sans font-bold text-md mt-2'>From {props.salary}</p>}
          </div>
          <p className='mt-3 text-neutral-700 w-[80%] text-justify line-clamp-6 max-sm:w-full'>{props.description}</p>
          <div className='flex gap-2 items-center mt-3'>
            {props.location && <p className='text-sm text-neutral-600'>{props.location}</p>}
            {'•'}
            <p className='text-sm underline underline-offset-4'>{props.position}</p>
          </div>
        </div>
        {renderImageOfSourceUrl(props.sourceUrl)}
      </div>
    </div>
  );
}
