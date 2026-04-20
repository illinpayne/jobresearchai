/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Files, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { useMe } from '@/api/hooks/useMe.hook';
import type { AiModelResponse } from '@/api/snapshots/ai/ai.dto';
import { availableModels } from '@/api/snapshots/ai/mock.data';
import { ROUTES } from '@/constants/routes';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';
import { cn } from '@/lib/utils';
import { useAIStore } from '@/states/useAiStorage.hook';
import { AiModels } from './ai-models-dropdown/ai-model-dropdown';
import type { AiModel } from './ai-models-dropdown/ai-model-row';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf'];

const schema = z.object({
  aiModel: z.string(),
  document: z
    .instanceof(File, { message: 'Please select a file.' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'File size must be less than 5MB.',
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: 'Only PDF files are accepted.',
    }),
});

export type SchemaValue = z.infer<typeof schema>;

// export const aiModels: AiModel[] = [
//   {
//     name: 'Junkie 1',
//     description: 'Try powerful think of junkie, fast & cheap analyse',
//   },
//   {
//     name: 'Junkie 1.2',
//     description: 'Test des for ai model',
//   },
//   {
//     name: 'Junkie 2',
//     description: 'Test desc',
//     shouldUpgrade: true,
//   },
//   {
//     name: 'Junkie 3',
//     description: 'Test desc',
//     shouldUpgrade: true,
//   },
// ];

export default function NewForm() {
  const { onOpen } = useBillingDialog();
  const { data: user } = useMe();
  const [mounted, setMounted] = useState(false);
  const aiStorage = useAIStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, formState, setValue, getValues } = useForm<SchemaValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      aiModel: '',
    },
  });
  const selectedFile = watch('document');

  async function onSubmit(values: SchemaValue) {
    console.log(values);
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setValue('document', files[0], { shouldValidate: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue('document', files[0], { shouldValidate: true });
    }
  };

  function getGreeting(date: Date = new Date(), user: any): any {
    const hour = date.getHours();
    const identifier = user && mounted ? user.firstName : 'who?';
    if (hour >= 0 && hour < 5) {
      return `Tonight's the night, ${identifier}`;
    }

    if (hour < 12) {
      return `Good morning, ${identifier}`;
    }

    if (hour < 17) {
      return `Afternoon, ${identifier}`;
    }

    return `Good evening, ${identifier}`;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setValue('aiModel', aiStorage.name);
  }, [setValue, aiStorage]);

  return (
    <div className='w-full h-3/4 flex items-center justify-center flex-col relative overflow-hidden'>
      <h1 className='font-borel text-5xl font-medium text-transparent bg-clip-text bg-linear-to-r leading-20 from-blue-700 to-emerald-800'>
        {getGreeting(new Date(), user)}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mt-5 text-sm  z-10'>
        <div className='bg-neutral-100 rounded-xl border min-w-120'>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl m-3 mb-0 p-5 cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all',
              getValues('document') ? 'border-emerald-500' : 'border-neutral-300',
              formState.errors.document && 'border-red-500',
            )}>
            {selectedFile ? (
              <div className='text-neutral-700'>
                {formState.errors.document ? formState.errors.document.message : `${selectedFile.name} uploaded`}
              </div>
            ) : (
              <p className='text-neutral-500 select-none'>What's resume you'll upload today? Drop your file here ...</p>
            )}
          </div>
          <div className='flex justify-between mt-5 p-5 pt-0'>
            <Link href={ROUTES.OVERVIEW.RESUMES}>
              <Files className='text-neutral-500 size-7 hover:bg-neutral-300 rounded-sm transition-all p-1' />
            </Link>
            <div className='flex items-center gap-3'>
              <Controller
                control={control}
                name='aiModel'
                render={({ field }) => (
                  <AiModels
                    models={[...availableModels.filter((f) => f.id !== aiStorage.id).slice(0, 3)]}
                    currentSelectedModel={availableModels.find((f) => f.name === field.value)}
                    onSelectModel={(model) => {
                      setValue('aiModel', model.name);
                      const findModel = availableModels.find((f) => f.name === model.name);
                      if (findModel) {
                        aiStorage.setModel(findModel);
                      }
                    }}
                    onUpgradeAction={() => {
                      onOpen();
                    }}
                  />
                )}
              />
              <button
                type='submit'
                disabled={!formState.isValid && !formState.errors.document}
                className='cursor-pointer disabled:cursor-default'>
                <Send
                  className={cn(
                    'size-5 ',
                    getValues('document') ? 'text-emerald-500' : 'text-neutral-700',
                    formState.errors.document && 'text-red-600',
                  )}
                />
              </button>
            </div>
          </div>
        </div>
        <input
          type='file'
          accept='image/jpeg, image/png, application/pdf'
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </form>
    </div>
  );
}
