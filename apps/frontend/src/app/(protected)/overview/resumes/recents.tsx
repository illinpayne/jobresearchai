'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useJobsInProgress } from '@/api/hooks/useJobsInProgress.hook';
import { useMe } from '@/api/hooks/useMe.hook';
import UploadedResumeInProgressCard from '@/components/shared/uploaded-resume-inprogress-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecentResumeUploads() {
  const { data, isLoading } = useJobsInProgress();
  const { data: me } = useMe();
  const queryClient = useQueryClient();

  if (isLoading && !data) {
    return (
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl font-semibold'>Recently uploads</h2>
        <div className='grid grid-cols-3 gap-4'>
          <Skeleton className='w-full h-34 bg-neutral-200'></Skeleton>
          <Skeleton className='w-full h-34 bg-neutral-200'></Skeleton>
          <Skeleton className='w-full h-34 bg-neutral-200'></Skeleton>
        </div>
      </div>
    );
  }

  if (!data || data.jobs.length === 0) {
    return <></>;
  }
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-semibold'>Recently uploads</h2>
      <div className='grid grid-cols-3 gap-4 max-lg:grid-cols-1 max-3xl:grid-cols-2'>
        {data?.jobs.map((f, i) => (
          <UploadedResumeInProgressCard
            key={f.id}
            workId={++i}
            queryClient={queryClient}
            email={me?.email}
            {...f}
          />
        )) ?? <Skeleton className='w-30 h-10 bg-neutral-200'></Skeleton>}
      </div>
    </div>
  );
}
