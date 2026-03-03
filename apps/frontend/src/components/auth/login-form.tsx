'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLogin } from '@/api/hooks/useLogin.hook';
import { Button, buttonVariants } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { Input } from '@/components/ui/input';
import { otpCodeDurationSeconds, ROUTES } from '@/constants';
import { useOtpTrigger } from '@/hooks';
import { persistSession } from '@/lib/client/session-persist';
import { cn } from '@/lib/utils';
import { AuthWrapper } from './auth-wrapper';
import { SendOtpRegisterForm } from './send-otp-register-form';

const loginSchema = z.object({
  email: z.email({ message: 'Enter correct email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(32, { message: 'Password must be no more than 32 characters long' }),
});

export type Login = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const { startTimer } = useOtpTrigger('register-otp', otpCodeDurationSeconds);

  const { mutateAsync, isPending } = useLogin({
    async onSuccess(data) {
      const { accessToken, account } = data;
      if (accessToken && typeof accessToken === 'string') {
        persistSession({ accessToken, account, queryClient });

        const { toast } = await import('sonner');
        toast.success('Logged in successfully');

        const redirectTo = searchParams.get('redirectTo') || ROUTES.OVERVIEW.DEFAULT;
        router.push(redirectTo);
      }
    },
    async onError(error: any) {
      const message = error.response?.data?.message;
      if (message === 'Account is not completely registered') {
        startTimer();
        setFormSubmitted(true);
        return;
      }
      const { toast } = await import('sonner');
      toast.error(message ?? 'Error during login');
    },
  });

  async function onSubmit(values: Login) {
    await mutateAsync({
      email: values.email,
      password: values.password,
    });
  }

  const { register, handleSubmit, getValues, formState } = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (formSubmitted) {
    return (
      <div className='min-h-screen overflow-hidden bg-linear-180 from-sky-400/40 via-white to-white flex justify-center items-center relative'>
        <div className='w-6 bg-blue-300 h-800 absolute rotate-80 -translate-y-20'></div>
        <div className='w-6 bg-blue-400 h-800 absolute rotate-80 -translate-y-10'></div>
        <div className='w-6 bg-blue-600 h-800 absolute rotate-80'></div>
        <SendOtpRegisterForm
          duration={otpCodeDurationSeconds}
          email={getValues('email')}
        />
      </div>
    );
  }

  return (
    <div className='h-screen overflow-hidden bg-linear-180 from-sky-400/40 via-white to-white grid grid-cols-7'>
      <div className='col-span-3 flex flex-col justify-center px-4'>
        <AuthWrapper
          heading='Sign in'
          className='min-w-[20em]'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4 min-w-102'>
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
                htmlFor='password'
                className='text-sm font-medium'>
                Password
              </label>
              <Input
                id='password'
                disabled={isPending}
                aria-invalid={!!formState.errors.password}
                type='password'
                {...register('password')}
              />
              <FormInputError>{formState.errors.password?.message}</FormInputError>
              <Link
                href={ROUTES.AUTH.FORGOT_PASSWORD}
                className={cn(buttonVariants({ variant: 'link' }), 'px-0 w-fit')}>
                Forgot password?
              </Link>
            </div>
            <Button
              type='submit'
              disabled={isPending || !formState.isValid}>
              {isPending ? <LoaderCircle className='animate-spin size-6' /> : 'Sign in'}
            </Button>
          </form>
          <p className='text-center text-sm'>
            Don't have an account?{' '}
            <Link
              href={ROUTES.AUTH.SIGNUP}
              className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>
              Sign up
            </Link>
          </p>
        </AuthWrapper>
      </div>
      <div className='col-span-4 overflow-hidden relative'>
        <Image
          src='/images/bg-auth.png'
          alt='Background'
          className='h-full w-full object-cover opacity-80'
          fill
        />
      </div>
    </div>
  );
}
