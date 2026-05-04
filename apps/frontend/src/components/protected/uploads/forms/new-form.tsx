/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { Files } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { type PresetsData, usePresets } from '@/api/hooks/usePresets.hook';
import { useUploadResume } from '@/api/hooks/useUploadResume.hook';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';
import { cn } from '@/lib/utils';
import { useAIStore } from '@/states/useAiStorage.hook';
import { AiModels } from '../ai-models-dropdown/ai-model-dropdown';
import { DynamicGreeting } from './greeting';
import { type NewFormSchemaValue, newFormSchema, type UploadResumeData } from './new-form.schema';
import { ThinkingScreen } from './thinking-screen';

function FormLogic({ presets }: { presets: PresetsData | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { onOpen } = useBillingDialog();
  const aiStorage = useAIStore();
  const { mutateAsync: uploadResume, isPending, isSuccess } = useUploadResume();

  const activeJobId = searchParams.get('jobId');
  const [isThinking, setIsThinking] = useState(!!activeJobId);

  const initialJobId = useRef(activeJobId).current;
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, formState, setValue, getValues } = useForm<NewFormSchemaValue>({
    resolver: zodResolver(newFormSchema),
    defaultValues: {
      aiModel: aiStorage.name,
    },
  });

  const selectedFile = watch('document');

  useEffect(() => {
    if (aiStorage) {
      if (getValues('aiModel') !== aiStorage.name) {
        setValue('aiModel', aiStorage.name);
      }
    }
  }, [aiStorage]);

  useEffect(() => {
    setIsThinking(!!activeJobId);
  }, [activeJobId]);

  async function onSubmit(values: NewFormSchemaValue) {
    const data: UploadResumeData = {
      presetId: presets?.available.find((f) => f.name === values.aiModel)?.id || '',
      file: values.document,
    };
    if (contentRef.current) contentRef.current.style.pointerEvents = 'none';

    await uploadResume(data, {
      onSuccess: (data) => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsThinking(true);
            router.push(`${pathname}?jobId=${data}`);
          },
        });

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
        });
      },
    });
  }

  const handleFile = (files: FileList | null) => {
    if (files && files.length > 0) setValue('document', files[0], { shouldValidate: true });
  };

  return (
    <div className='w-full h-3/4 flex items-center justify-center flex-col relative overflow-hidden'>
      {!isThinking && (
        <div
          ref={contentRef}
          className='flex flex-col items-center justify-center w-full max-w-3xl'>
          <DynamicGreeting />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='mt-5 text-sm z-10'>
            <div className='bg-neutral-100 rounded-xl border min-w-120'>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files);
                }}
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
                  <p className='text-neutral-500 select-none'>What resume will you upload today? Drop your file here ...</p>
                )}
              </div>
              <div className='flex justify-between mt-5 p-5 pt-0'>
                <Link href={ROUTES.OVERVIEW.RESUMES}>
                  <Files className='text-neutral-500 size-7 hover:bg-neutral-300 rounded-sm transition-all p-1' />
                </Link>
                <div className='flex items-center gap-3'>
                  {presets?.available && (
                    <Controller
                      control={control}
                      name='aiModel'
                      render={({ field }) => (
                        <AiModels
                          models={[...presets.available.filter((f) => f.id !== aiStorage.id).slice(0, 3)]}
                          currentSelectedModel={presets.available.find((f) => f.name === field.value)}
                          onSelectModel={(model) => {
                            field.onChange(model.name);
                            const findModel = presets.available.find((f) => f.name === model.name);
                            if (findModel) aiStorage.setModel(findModel);
                          }}
                          onUpgradeAction={onOpen}
                          isError={!!formState.errors.aiModel}
                        />
                      )}
                    />
                  )}
                  {/* TODO: Make not Analysing..., run animation immediately, then just show error or realtime thinking */}
                  <button
                    type='submit'
                    disabled={!formState.isValid || isSuccess}
                    className={cn(
                      'cursor-pointer disabled:cursor-default disabled:opacity-50 transition-opacity flex items-center p-0',
                      buttonVariants({ variant: 'outline' }),
                      formState.isValid
                        ? 'border-primary text-primary hover:text-primary hover:bg-primary/10'
                        : 'border-neutral-500 text-neutral-600',
                    )}>
                    <span>{isPending ? 'Analysing...' : isSuccess ? 'Pushed' : 'Analyse'}</span>
                  </button>
                </div>
              </div>
            </div>
            <input
              type='file'
              accept='application/pdf'
              className='hidden'
              ref={fileInputRef}
              onChange={(e) => handleFile(e.target.files)}
            />
          </form>
        </div>
      )}
      {isThinking && (
        <ThinkingScreen
          activeJobId={activeJobId}
          accountId={'UB3j5H8IBo4E9eEZt1lm4'}
          animateEntrance={!initialJobId}
        />
      )}
    </div>
  );
}

export default function NewForm() {
  const { data: presets } = usePresets();

  return (
    <Suspense fallback={<></>}>
      <FormLogic presets={presets} />
    </Suspense>
  );
}
