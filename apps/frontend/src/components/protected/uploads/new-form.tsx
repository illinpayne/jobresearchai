/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { Files, Send } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { useMe } from '@/api/hooks/useMe.hook';
import { availableModels } from '@/api/snapshots/ai/mock.data';
import { ROUTES } from '@/constants/routes';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';
import { cn } from '@/lib/utils';
import { useAIStore } from '@/states/useAiStorage.hook';
import { AiModels } from './ai-models-dropdown/ai-model-dropdown';

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

export default function NewForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { onOpen } = useBillingDialog();
  const { data: user } = useMe();
  const [mounted, setMounted] = useState(false);
  const aiStorage = useAIStore();

  const activeJobId = searchParams.get('jobId');
  const [isThinking, setIsThinking] = useState(!!activeJobId);
  const [progressStatus, setProgressStatus] = useState('Initializing AI Engine...');

  const contentRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);

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

    if (contentRef.current) contentRef.current.style.pointerEvents = 'none';

    // A. Start the elegant dismissal animation
    const tl = gsap.timeline();
    tl.to(contentRef.current, {
      y: -15,
      scale: 1.03,
      duration: 0.25,
      ease: 'circ.out',
      opacity: 0.98,
    }).to(contentRef.current, {
      y: 100,
      scale: 0.7,
      opacity: 0,
      duration: 0.5,
      ease: 'expo.in',
      onComplete: () => {
        const startUploadJob = async () => {
          try {
            setProgressStatus('Uploading securely...');
            setIsThinking(true);

            // Mocking API call
            const mockJobId = 'job_' + Math.random().toString(36).substring(7);

            // Push to URL
            router.push(`${pathname}?jobId=${mockJobId}`);
          } catch (error) {
            console.error('Upload failed', error);
            setIsThinking(false);
          }
        };

        // 2. Call it immediately (without returning it)
        startUploadJob();
      },
    });
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

  useEffect(() => {
    if (!activeJobId) return;

    // We have a jobId, so make sure UI is in thinking mode (handles page refreshes)
    setIsThinking(true);

    // Setup your WebSocket connection here
    console.log(`Connecting to WebSocket for Job: ${activeJobId}`);
    // const ws = new WebSocket(`wss://yourserver.com/ws/${activeJobId}`);

    // Mocking WebSocket progress for example:
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress === 25) setProgressStatus('Extracting Document Vectors...');
      if (progress === 50) setProgressStatus('Running Semantic Analysis...');
      if (progress === 75) setProgressStatus('Synthesizing Final Output...');
      if (progress === 100) {
        setProgressStatus('Complete!');
        clearInterval(interval);
      }
    }, 2000);

    return () => {
      // Cleanup WebSocket on unmount
      // ws.close();
      clearInterval(interval);
    };
  }, [activeJobId, router]);

  useEffect(() => {
    if (isThinking && thinkingRef.current) {
      gsap.fromTo(
        thinkingRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      );
    }
  }, [isThinking]);

  return (
    <div className='w-full h-3/4 flex items-center justify-center flex-col relative overflow-hidden'>
      {!isThinking && (
        <div
          ref={contentRef}
          className='flex flex-col items-center justify-center w-full max-w-3xl'>
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
      )}
      {isThinking && (
        <div
          ref={thinkingRef}
          className='flex flex-col items-center justify-center absolute inset-0 z-20'>
          <div className='ai-fluid-container'>
            <div className='ai-orb orb-magenta'></div>
            <div className='ai-orb orb-purple'></div>
            <div className='ai-orb orb-cyan'></div>
            <div className='ai-fluid-core'></div>
          </div>

          {/* Dynamic real-time status text */}
          <div className='mt-8 flex flex-col items-center'>
            <p className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-fuchsia-600 font-medium tracking-wide animate-pulse'>
              {progressStatus}
            </p>
            <p className='text-xs text-neutral-400 mt-1 font-mono tracking-widest uppercase'>
              AI Engine Active • {activeJobId ? 'Processing' : 'Connecting'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
