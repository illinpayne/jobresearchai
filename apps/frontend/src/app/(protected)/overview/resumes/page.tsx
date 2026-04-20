import type { Metadata } from 'next';
import UploadedResumeCard from '@/components/shared/uploaded-resume-card';

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
          <div className='flex flex-col gap-3'>
            <h2 className='text-2xl font-semibold'>Recently uploads</h2>
            <div className='grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
              <UploadedResumeCard
                years={20}
                position='Frontend Developer'
                location={'Remote'}
                data={[
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                ]}
                accessibilityRating={100}
              />
              <UploadedResumeCard
                years={20}
                position='Frontend Developer'
                location={'Remote'}
                data={[
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                ]}
                accessibilityRating={48}
              />
              <UploadedResumeCard
                years={20}
                position='Frontend Developer'
                location={'Remote'}
                data={[
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                ]}
                accessibilityRating={48}
              />
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='text-2xl font-semibold'>All uploads</h2>
            <div className='grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-1 max-xl:grid-cols-2 max-2xl:grid-cols-3'>
              <UploadedResumeCard
                years={20}
                position='Frontend Developer'
                location={'Remote'}
                data={[
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                ]}
                accessibilityRating={68}
              />
              <UploadedResumeCard
                years={20}
                position='Frontend Developer'
                location={'Remote'}
                data={[
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                ]}
                accessibilityRating={85}
              />
              <UploadedResumeCard
                years={20}
                position='Frontend Developer'
                location={'Remote'}
                data={[
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                  { key: 'Benefits', value: '10 stacks' },
                ]}
                accessibilityRating={95}
              />
              <div className='col-span-full text-center'>
                <button className='text-sm text-neutral-600 cursor-pointer hover:text-primary transition-all'>See more</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
