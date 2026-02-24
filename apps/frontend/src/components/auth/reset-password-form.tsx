'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useResetPassword } from '@/api/hooks/useResetPassword.hook';
import { Button } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ROUTES } from '@/constants';
import { AuthWrapper } from './auth-wrapper';

const resetPasswordSchema = z
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

export type ResetPassword = z.infer<typeof resetPasswordSchema>;

interface IProps {
  email: string;
}

export function ResetPasswordForm({ email }: IProps) {
  const router = useRouter();

  const { mutateAsync, isPending } = useResetPassword({
    async onSuccess() {
      const { toast } = await import('sonner');
      toast.info('Password reset successfully, sign in with new password');

      const redirectTo = ROUTES.AUTH.SIGNIN();
      router.push(redirectTo);
    },
    async onError(error: any) {
      const { toast } = await import('sonner');
      toast.error(error.response?.data?.message ?? 'Error during resetting password');
      reset({ code: '' });
    },
  });

  async function onSubmit(values: ResetPassword) {
    await mutateAsync({
      email: email,
      newPassword: values.passwordConfirmation,
      code: values.code,
    });
    reset({ code: '' });
  }

  const { handleSubmit, register, control, reset, formState } = useForm<ResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
    },
  });

  return (
    <AuthWrapper
      heading='Reset password'
      className='bg-white rounded-md px-10 py-10 shadow-sm z-10 min-w-100'
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
                  <InputOTPGroup className='flex justify-center gap-2 w-full *:border-l'>
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
          {isPending ? <LoaderCircle className='animate-spin size-6' /> : 'Verify'}
        </Button>
      </form>
    </AuthWrapper>
  );
}
