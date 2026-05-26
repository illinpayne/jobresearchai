'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useResendRegisterOtp } from '@/api/hooks/useResendRegisterOtp.hook';
import { useVerifyRegisterOtp } from '@/api/hooks/useVerifyRegisterOtp.hook';
import { Button } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ROUTES } from '@/constants';
import { useOtpTrigger } from '@/hooks';
import { billingSubscriptionCacheKey, RemoveCache } from '@/lib/cache';
import { persistSession } from '@/lib/client/session-persist';
import { OtpTimer } from '../shared/otp-timer';
import { AuthWrapper } from './auth-wrapper';

const otpSchema = z.object({
  code: z
    .string()
    .length(6, { message: 'Your one-time password must be 6 characters.' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers.' }),
});

export type OtpCode = z.infer<typeof otpSchema>;

interface IProps {
  email: string;
  duration: number;
}

export function SendOtpRegisterForm({ email, duration }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { clearTimer } = useOtpTrigger('register-otp', duration);

  const { mutateAsync, isPending } = useVerifyRegisterOtp({
    async onSuccess(data) {
      const { accessToken, account } = data;
      if (accessToken && typeof accessToken === 'string') {
        persistSession({ accessToken, account, queryClient });
        clearTimer();

        RemoveCache(billingSubscriptionCacheKey);
        queryClient.refetchQueries({ queryKey: ['billing-subscription'] });

        const { toast } = await import('sonner');
        toast.success('Account verified, go ahead :)');

        const redirectTo = searchParams.get('redirectTo') || ROUTES.OVERVIEW.DEFAULT;
        router.push(redirectTo);
      }
    },
    async onError(error: any) {
      const { toast } = await import('sonner');
      toast.error(error.response?.data?.message ?? 'Error during registration');
      reset({ code: '' });
    },
  });

  const { mutateAsync: mutateResend } = useResendRegisterOtp({
    async onSuccess() {
      const { toast } = await import('sonner');
      toast.success('OTP code resent successfully');
    },
    async onError(error: any) {
      const { toast } = await import('sonner');
      toast.error(error.response?.data?.message ?? 'Error during resending OTP code');
    },
  });

  async function onSubmit(values: OtpCode) {
    await mutateAsync({
      email,
      code: values.code,
    });
    reset({ code: '' });
  }

  const { handleSubmit, control, reset, formState } = useForm<OtpCode>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  async function onResend() {
    await mutateResend({ email });
    reset({ code: '' });
  }

  return (
    <AuthWrapper
      heading='Verify code'
      className='bg-white rounded-md px-10 py-10 shadow-sm z-10 min-w-100 max-sm:bg-white/70 max-sm:backdrop-blur-lg max-sm:shadow-none'
      isSocialAuth={false}>
      <p className='line-clamp-2 max-w-100'>
        Please, check the <span className='text-primary'>{email}</span> to verify the code
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 mt-5'>
        <div>
          <Controller
            control={control}
            name='code'
            render={({ field }) => (
              <div className='mb-2'>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}>
                  <InputOTPGroup className='flex justify-center gap-2 w-full *:border-l max-sm:*:bg-white max-sm:*:border-none max-sm:*:text-lg'>
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
        <Button
          type='submit'
          disabled={isPending || !formState.isValid}>
          {isPending ? <LoaderCircle className='animate-spin size-6' /> : 'Verify'}
        </Button>
        <OtpTimer
          storageKey='register-otp'
          duration={duration}
          onResend={onResend}
        />
      </form>
    </AuthWrapper>
  );
}
