'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useForgotPassword } from '@/api/hooks/useForgotPassword.hook';
import { Button, buttonVariants } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import { AuthWrapper } from './auth-wrapper';
import { ResetPasswordForm } from './reset-password-form';

const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Enter correct email address' }),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const { mutateAsync, isPending } = useForgotPassword({
    async onError(error: any) {
      const { toast } = await import('sonner');
      toast.error('Code already sent on email, check your inbox');
    },
  });

  async function onSubmit(values: ForgotPassword) {
    try {
      await mutateAsync({
        email: values.email,
      });
    } catch (error) {}
    setFormSubmitted(true);
  }

  const { register, handleSubmit, getValues, formState } = useForm<ForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <div className='min-h-screen overflow-hidden bg-linear-180 from-sky-400/40 via-white to-white flex justify-center items-center relative'>
      <div className='w-6 bg-blue-300 h-800 absolute rotate-80 -translate-y-20'></div>
      <div className='w-6 bg-blue-400 h-800 absolute rotate-80 -translate-y-10'></div>
      <div className='w-6 bg-blue-600 h-800 absolute rotate-80'></div>
      {formSubmitted ? (
        <ResetPasswordForm email={getValues('email')} />
      ) : (
        <AuthWrapper
          isSocialAuth={false}
          className='bg-white rounded-md px-10 py-10 shadow-sm z-10 max-sm:bg-white/70 max-sm:backdrop-blur-lg max-sm:shadow-none'
          heading='Reset password'>
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
            <Button
              type='submit'
              disabled={isPending || !formState.isValid}>
              {isPending ? <LoaderCircle className='animate-spin size-6' /> : 'Send code'}
            </Button>
            <p className='text-center text-sm'>
              Want to sign in?{' '}
              <Link
                href={ROUTES.AUTH.SIGNIN()}
                className={cn(buttonVariants({ variant: 'link' }), 'px-0')}>
                Sign in
              </Link>
            </p>
          </form>
        </AuthWrapper>
      )}
    </div>
  );
}
