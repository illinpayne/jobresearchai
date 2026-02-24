'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useForgotPassword } from '@/api/hooks/useForgotPassword.hook';
import { useMe } from '@/api/hooks/useMe.hook';
import { useResetPassword } from '@/api/hooks/useResetPassword.hook';
import { Button } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Skeleton } from '@/components/ui/skeleton';
import { changePasswordCacheKey, DisposeCache, GetPasswordChangeCache, isCacheExpired, SetPasswordChangeCache } from '@/lib/cache';

const changePasswordSchema = z
  .object({
    code: z
      .string()
      .length(6, { message: 'Your one-time password must be 6 characters.' })
      .regex(/^\d+$/, { message: 'Code must contain only numbers.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(32, { message: 'Password must be no more than 32 characters long' }),
    passwordConfirmation: z.string().min(6, {
      message: 'Password confirmation must be at least 6 characters long',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const { data: user } = useMe();
  const { mutateAsync: sendOTPAsync, isPending: isOTPPending } = useForgotPassword({
    async onSuccess() {
      if (user) {
        const { toast } = await import('sonner');
        SetPasswordChangeCache();
        toast.info(`OTP was sent on ${user.email}.`);
        setOTPSubmitted(true);
      }
    },
    async onError(error: any) {
      const { toast } = await import('sonner');
      toast.error(error.response?.data?.message ?? 'Error during changing password');
    },
  });
  const [isOTPSubmitted, setOTPSubmitted] = useState(false);

  const { mutateAsync, isPending, isSuccess } = useResetPassword({
    async onSuccess() {
      const { toast } = await import('sonner');
      setOTPSubmitted(false);
      DisposeCache(changePasswordCacheKey);
      reset({ password: '', passwordConfirmation: '', code: '' });
      toast.info('Password reset successfully!');
    },
    async onError(error: any) {
      const message = error.response?.data?.message;
      const { toast } = await import('sonner');
      if (message === 'Expired code') {
        setOTPSubmitted(false);
        DisposeCache(changePasswordCacheKey);
        toast.warning('Code expired, please resend code again');
        return;
      }
      toast.error(message ?? 'Error during changing password');
      reset({ code: '' });
    },
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function onSubmit(values: ChangePasswordValues) {
    if (user) {
      await mutateAsync({
        code: values.code,
        newPassword: values.passwordConfirmation,
        email: user.email,
      });
    }
  }

  async function onSendOTP() {
    if (user) {
      const age = GetPasswordChangeCache();
      if (age && !isCacheExpired(age.createdAt)) {
        setOTPSubmitted(true);
        const { toast } = await import('sonner');
        toast.error(`OTP was already sent on ${user.email}.`);
        return;
      }
      await sendOTPAsync({ email: user.email });
    }
  }

  const { register, handleSubmit, formState, reset, control } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
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
          htmlFor='password'
          className='text-sm font-medium'>
          Password
        </label>
        <Input
          type='password'
          id='password'
          disabled={isPending}
          {...register('password')}
          aria-invalid={!!formState.errors.password}
        />
        <FormInputError>{formState.errors.password?.message}</FormInputError>
      </div>
      <div>
        <label
          htmlFor='passwordConfirmation'
          className='text-sm font-medium'>
          Confirm password
        </label>
        <Input
          id='passwordConfirmation'
          type='password'
          disabled={isPending}
          aria-invalid={!!formState.errors.passwordConfirmation}
          {...register('passwordConfirmation')}
        />
        <FormInputError>{formState.errors.passwordConfirmation?.message}</FormInputError>
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
