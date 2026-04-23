'use client';

import Link from 'next/link';
import { availableModels } from '@/api/snapshots/ai/mock.data';
import type { ResumeResponse } from '@/api/snapshots/resumes/resume.types';
import AvailableAiModels from '@/components/protected/ai/available-ai-models';
import UploadedResumeCard from '@/components/shared/uploaded-resume-card';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

interface Props {
  resumes: ResumeResponse[];
}

export default function RecentResumeUploads({ ...props }: Props) {
  if (!props.resumes || props.resumes.length === 0) {
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
        {availableModels.length > 0 && (
          <AvailableAiModels
            availableModels={availableModels}
            hideTitle
          />
        )}
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-2xl font-semibold'>Recently uploads</h2>
      <div className='grid gap-y-4'>
        {props.resumes.map((f) => (
          <UploadedResumeCard
            key={f.id}
            {...f}
          />
        ))}
      </div>
    </div>
  );
}
