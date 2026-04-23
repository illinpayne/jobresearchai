import type { Metadata } from 'next';
import Link from 'next/link';
import { jobs } from '@/api/snapshots/jobs/jobs';
import JobFilter from '@/components/protected/foundjobs/job-filter';
import JobCard from '@/components/shared/job-card';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Related jobs for you',
};

export default function FoundJobsPage() {
  const foundJobs = false;

  if (!foundJobs) {
    return (
      <div className='pb-10 relative overflow-x-hidden'>
        <div className='bg-linear-to-b from-primary/15 via-white to-white h-[50vh] absolute top-0 w-full -z-10'></div>
        <section className='grid w-[90%] mx-auto xs:w-auto lg:w-[90%] xl:w-[90%] 2xl:w-[80%] z-10 max-2xl:px-5'>
          <div className='py-40 pb-20'>
            <h1 className='text-4xl font-nunito-sans font-bold'>There is no found jobs yet</h1>
            <p className='text-xl text-neutral-600 mt-3'>Upload your first resume to start finding job of your dream!</p>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 items-center'>
            <p className='font-bold text-2xl'>1.</p>
            <div>Make a new chat with AI to analyse your first resume.</div>
            <p className='font-bold text-2xl'>2.</p>
            <div>Wait it gather all the information.</div>

            <p className='font-bold text-2xl'>3.</p>
            <div>See the most revelant jobs.</div>
            <p className='font-bold text-2xl'>4.</p>
            <div>
              You might want to use wider possibilies with{' '}
              <Link
                href={ROUTES.OVERVIEW.AI}
                className='text-indigo-500 font-bold font-nunito-sans underline underline-offset-2'>
                AI
              </Link>
            </div>
          </div>

          <Link
            href={ROUTES.OVERVIEW.NEW_RESUME}
            className={cn(buttonVariants({ variant: 'outline' }), 'w-fit mt-6')}>
            Let's start
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className='py-10 max-xl:py-5 xl:py-10'>
      <section className='grid px-5 max-2xl:px-5'>
        <div className='grid grid-cols-[1fr_4fr] gap-5 items-start relative max-xl:grid-cols-1 xl:grid-cols-[1fr_1.5fr] 2xl:grid-cols-[1fr_3fr] 3xl:grid-cols-[1fr_4fr]'>
          <JobFilter />
          <div className='flex flex-col gap-3 flex-1'>
            <h2 className='text-2xl font-semibold'>Found 157 jobs</h2>
            <div className='grid grid-cols-1 gap-5'>
              {jobs.map((f, i) => (
                <JobCard
                  key={i}
                  {...f}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
