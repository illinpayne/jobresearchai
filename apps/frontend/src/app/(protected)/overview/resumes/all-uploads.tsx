'use client';

import type { ResumeResponse } from '@/api/snapshots/resumes/resume.types';
import UploadedResumeCard from '@/components/shared/uploaded-resume-card';

interface Props {
  resumes: ResumeResponse[];
}

export default function AllResumeUploads({ ...props }: Props) {
  if (!props.resumes || props.resumes.length === 0) {
    return <></>;
  }
  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-2xl font-semibold'>All uploads</h2>
      <div className='grid grid-cols-2 gap-5 max-xl:grid-cols-1'>
        {props.resumes.map((f) => (
          <UploadedResumeCard
            key={f.id}
            {...f}
          />
        ))}
        <div className='col-span-full text-center'>
          <button className='text-sm text-neutral-600 cursor-pointer hover:text-primary transition-all'>See more</button>
        </div>
      </div>
    </div>
  );
}
