import type { Metadata } from 'next';
import AllResumeUploads from './all-uploads';
import RecentResumeUploads from './recents';

export const metadata: Metadata = {
  title: 'Exlore your uploads',
};

export default function ResumesPage() {
  return (
    <div className='pb-10 relative overflow-x-hidden'>
      <div className='bg-linear-to-b from-emerald-400/15 via-white to-white h-[50vh] absolute top-0 w-full -z-10'></div>
      <section className='grid w-[90%] mx-auto xs:w-auto lg:w-[90%] xl:w-[90%] 2xl:w-[80%] z-10 max-2xl:px-5'>
        <div className='py-40'>
          <h1 className='text-4xl font-nunito-sans font-bold'>Review your uploaded resumes</h1>
          <p className='text-xl text-neutral-600 mt-3'>Improve your resume to find a new job faster</p>
        </div>
        <div className='grid gap-20'>
          <RecentResumeUploads />
          <AllResumeUploads />
        </div>
      </section>
    </div>
  );
}
