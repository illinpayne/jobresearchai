'use client';

import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import type { JobResponse } from '@/api/snapshots/jobs/jobs.dto';
import { cn } from '@/lib/utils';

export default function JobCard({ ...props }: JobResponse) {
  function formatSmartDate(date: Date): string {
    const now = new Date();
    const diffInDays = differenceInDays(now, date);

    if (diffInDays >= 2) {
      return format(date, 'dd.MM.yyyy');
    }

    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all outline hover:outline-primary group h-auto overflow-hidden',
        false && 'outline-emerald-500 bg-emerald-500/5 hover:bg-emerald-700/15 hover:outline-emerald-700',
        props.tags?.includes('hot') && 'bg-linear-to-br from-white to-abmer-500',
      )}>
      <div className='grid grid-cols-[1fr_auto] max-sm:grid-cols-1'>
        <div>
          <div className='w-full flex justify-between items-center gap-5'>
            <Link
              href={'https://www.work.ua/jobs/7785729/'}
              target='_blank'
              className='text-2xl font-semibold leading-7 hover:text-blue-500'>
              {props.position}
            </Link>
          </div>
          <div className='grid gap-1 items-center'>
            {props.salary && <p className='font-nunito-sans font-bold text-md mt-2'>{props.salary}</p>}
            {props.location && <p className='text-sm text-neutral-600'>{props.location}</p>}
          </div>
          <p className='mt-3 text-neutral-700 w-[80%] text-justify line-clamp-6 max-sm:w-full'>{props.description}</p>
          <div className='flex gap-4 items-center mt-3'>
            <p className='text-sm text-neutral-600 '>{props.uploadedAt ? formatSmartDate(props.uploadedAt) : 'Recently uploaded'}</p>
            <p className='text-sm text-blue-800'>{props.industry}</p>
          </div>
        </div>
        {props.sourceImageUrl && (
          <div className='flex items-start max-sm:hidden'>
            <Image
              src={props.sourceImageUrl}
              alt='source-workua'
              className='rounded-sm aspect-square object-cover'
              width={70}
              height={70}
            />
          </div>
        )}
      </div>
    </div>
  );
}
