'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useChangeEmail } from '@/api/hooks/useChangeEmail.hook';
import { useMe } from '@/api/hooks/useMe.hook';
import { useSendEmailOTP } from '@/api/hooks/useSendEmailOTP.hook';
import { Button } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants';
import { changeEmailCacheKey, GetEmailChangeCache, isCacheExpired, RemoveCache, SetEmailChangeCache } from '@/lib/cache';
import { cleanSession } from '@/lib/client/session-persist';

const changeEmailSchema = z.object({
  code: z
    .string()
    .length(6, { message: 'Your one-time password must be 6 characters.' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers.' }),
  email: z.email({ message: 'Enter correct email address' }),
});

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

export default function ChangeEmailForm() {
  const [isOTPSubmitted, setOTPSubmitted] = useState(false);
  const { data: user } = useMe();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: sendOTPAsync, isPending: isOTPPending } = useSendEmailOTP({
    async onSuccess() {
      if (user) {
        const { toast } = await import('sonner');
        SetEmailChangeCache();
        toast.info(`OTP was sent on ${user.email}.`);
        setOTPSubmitted(true);
      }
    },
    async onError(error: any) {
      const { toast } = await import('sonner');
      toast.error(error.response?.data?.message ?? 'Error during changing email');
    },
  });

  const { mutateAsync, isPending, isSuccess } = useChangeEmail({
    async onSuccess() {
      const { toast } = await import('sonner');
      reset({ email: '', code: '' });
      setOTPSubmitted(false);
      RemoveCache(changeEmailCacheKey);
      cleanSession(queryClient);
      toast.info('Email changed successfully, re-login to continue');
      router.replace(ROUTES.AUTH.SIGNIN(pathname));
    },
    async onError(error: any) {
      const message = error.response?.data?.message;
      const { toast } = await import('sonner');
      if (message === 'Expired code') {
        setOTPSubmitted(false);
        RemoveCache(changeEmailCacheKey);
        toast.warning('Code expired, please resend code again');
        return;
      }
      toast.error(message ?? 'Error during changing email');
      reset({ code: '' });
    },
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function onSubmit(values: ChangeEmailValues) {
    if (user) {
      await mutateAsync({
        code: values.code,
        newEmail: values.email,
      });
    }
  }

  async function onSendOTP() {
    if (user) {
      const age = GetEmailChangeCache();
      if (age && !isCacheExpired(age.createdAt)) {
        setOTPSubmitted(true);
        const { toast } = await import('sonner');
        toast.error(`OTP was already sent on ${user.email}.`);
        return;
      }
      await sendOTPAsync();
    }
  }

  const { register, handleSubmit, formState, reset, control } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  if (!user || !isMounted) {
    return (
      <div className='w-full flex flex-col gap-5 *:space-y-2'>
        <div>
          <Skeleton className='w-20 h-5' />
          <Skeleton className='w-full h-10' />
        </div>
        <div>
          <Skeleton className='w-20 h-5' />
          <Skeleton className='w-full h-10' />
        </div>
        <Skeleton className='w-30 h-10 ml-auto' />
      </div>
    );
  }

  if (!isOTPSubmitted) {
    return (
      <div className='flex justify-between items-center w-full'>
        <p className='text-neutral-800 text-sm'>Send OTP code to {user.email}</p>
        <Button onClick={onSendOTP}>
          {isOTPPending ? <LoaderCircle className='animate-spin size-6' /> : isOTPSubmitted ? 'Sent!' : 'Send OTP'}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 w-full'>
      <div>
        <label
          htmlFor='email'
          className='text-sm font-medium'>
          Email
        </label>
        <Input
          type='email'
          id='email'
          disabled={isPending}
          {...register('email')}
          aria-invalid={!!formState.errors.email}
          placeholder='tony.soprano@jrai.com'
        />
        <FormInputError>{formState.errors.email?.message}</FormInputError>
      </div>

      <div>
        <label
          htmlFor='OTPCode'
          className='text-sm font-medium'>
          Verify code
        </label>
        <Controller
          control={control}
          name='code'
          render={({ field }) => (
            <div className='mb-2'>
              <InputOTP
                id='OTPCode'
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}>
                <InputOTPGroup className='flex gap-2 w-full *:border-l'>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}
        />
        <FormInputError>{formState.errors.code?.message}</FormInputError>
      </div>
      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={isPending || !formState.isValid}>
          {isPending ? <LoaderCircle className='animate-spin size-6' /> : isSuccess ? 'Updated!' : 'Update'}
        </Button>
      </div>
    </form>
  );
}
