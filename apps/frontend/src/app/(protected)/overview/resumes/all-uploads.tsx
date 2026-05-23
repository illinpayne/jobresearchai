'use client';

import Link from 'next/link';
import { useProfiles } from '@/api/hooks/useProfiles.hook';
import UploadedResumeCard from '@/components/shared/uploaded-resume-card';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

export default function AllResumeUploads() {
  const { data: profiles, isLoading } = useProfiles();

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3'>
        <div className='grid grid-cols-2 gap-5 max-xl:grid-cols-1'>
          <Skeleton className='size-full h-[40vh]' />
          <Skeleton className='size-full h-[40vh]' />
        </div>
      </div>
    );
  }

  if (!profiles || !profiles.data || profiles.data.length === 0) {
    return (
      <div className='flex flex-col gap-3'>
        <h2 className='text-2xl font-semibold'>Analyse your resume to get assistance</h2>
        <div className='mb-5'>
          <p className='text-neutral-600 inline'>Get your resume analysed with AI power. Choose model whatever you want, get insights, </p>
          <Link
            href={ROUTES.OVERVIEW.NEW_RESUME}
            className={cn(buttonVariants({ variant: 'link' }), 'w-min, px-0')}>
            Start analysing
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-4'>
          <Skeleton className='w-full h-34 bg-linear-to-b from-green-300/40 to-green-300/20'></Skeleton>
          <Skeleton className='w-full h-34 bg-linear-to-b from-green-300/20 to-green-300/0'></Skeleton>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-2xl font-semibold'>All uploads</h2>
      <div className='grid grid-cols-1 gap-5 max-xl:grid-cols-1'>
        {profiles.data.map((f) => (
          <UploadedResumeCard
            key={f.profile.id}
            {...f}
          />
        ))}
        {/* <div className='col-span-full text-center'>
          <button className='text-sm text-neutral-600 cursor-pointer hover:text-primary transition-all'>See more</button>
        </div> */}
      </div>
    </div>
  );
}
