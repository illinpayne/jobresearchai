'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSendRegisterOtp } from '@/api/hooks/useSendRegisterOtp.hook';
import { Button, buttonVariants } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { Input } from '@/components/ui/input';
import { otpCodeDurationSeconds, ROUTES } from '@/constants';
import { useOtpTrigger } from '@/hooks';
import { cn } from '@/lib/utils';
import { AuthWrapper } from './auth-wrapper';
import { SendOtpRegisterForm } from './send-otp-register-form';

const registerSchema = z
  .object({
    email: z.email({ message: 'Enter correct email address' }),
    firstName: z.string().min(1, { message: 'First name is required' }),
    secondName: z.string().min(1, { message: 'Second name is required' }),
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

export type Register = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const { startTimer } = useOtpTrigger('register-otp', otpCodeDurationSeconds);

  const { mutateAsync, isPending } = useSendRegisterOtp({
    async onError(error: any) {
      const { toast } = await import('sonner');
      toast.error(error.response?.data?.message ?? 'Error during registration');
      resetForm();
    },
  });

  async function onSubmit(values: Register) {
    await mutateAsync({
      email: values.email,
      firstName: values.firstName,
      secondName: values.secondName,
      password: values.passwordConfirmation,
    });
    startTimer();
    setFormSubmitted(true);
  }

  function resetForm() {
    reset({
      email: '',
      password: '',
      passwordConfirmation: '',
    });
  }

  const { register, handleSubmit, reset, getValues, formState } = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  return (
    <div className='min-h-screen overflow-hidden bg-linear-180 from-sky-400/40 via-white to-white flex justify-center items-center relative'>
      <div className='w-6 bg-blue-300 h-800 absolute rotate-80 -translate-y-20'></div>
      <div className='w-6 bg-blue-400 h-800 absolute rotate-80 -translate-y-10'></div>
      <div className='w-6 bg-blue-600 h-800 absolute rotate-80'></div>
      {formSubmitted ? (
        <SendOtpRegisterForm
          duration={otpCodeDurationSeconds}
          email={getValues('email')}
        />
      ) : (
        <AuthWrapper
          heading='Sign up'
          className='bg-white rounded-md max-w-160 px-10 py-10 shadow-sm z-10 max-sm:bg-white/70 max-sm:backdrop-blur-lg max-sm:shadow-none'
          isSocialAuth={false}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'>
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
            <div className='grid grid-cols-2 gap-4 max-md:grid-cols-1'>
              <div>
                <label
                  htmlFor='firstName'
                  className='text-sm font-medium'>
                  First name
                </label>
                <Input
                  type='text'
                  id='firstName'
                  disabled={isPending}
                  {...register('firstName')}
                  aria-invalid={!!formState.errors.firstName}
                  placeholder='Tony'
                />
                <FormInputError>{formState.errors.firstName?.message}</FormInputError>
              </div>
              <div>
                <label
                  htmlFor='secondName'
                  className='text-sm font-medium'>
                  Second name
                </label>
                <Input
                  type='text'
                  id='secondName'
                  disabled={isPending}
                  {...register('secondName')}
                  aria-invalid={!!formState.errors.secondName}
                  placeholder='Soprano'
                />
                <FormInputError>{formState.errors.secondName?.message}</FormInputError>
              </div>
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
                type='password'
                {...register('password')}
              />
              <FormInputError>{formState.errors.password?.message}</FormInputError>
            </div>
            <div>
              <label
                htmlFor='confirmPassword'
                className='text-sm font-medium'>
                Confirm password
              </label>
              <Input
                id='confirmPassword'
                disabled={isPending}
                type='password'
                {...register('passwordConfirmation')}
              />
              <FormInputError>{formState.errors.passwordConfirmation?.message}</FormInputError>
            </div>
            <Button
              type='submit'
              disabled={isPending || !formState.isValid}>
              {isPending ? <LoaderCircle className='animate-spin size-6' /> : 'Send code'}
            </Button>
          </form>
          <p className='text-sm text-center'>
            Already have an account?{' '}
            <Link
              href={ROUTES.AUTH.SIGNIN()}
              className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>
              Sign in
            </Link>
          </p>
        </AuthWrapper>
      )}
    </div>
  );
}
