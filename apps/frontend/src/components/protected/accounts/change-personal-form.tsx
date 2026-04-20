'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useChangePersonalData } from '@/api/hooks/useChangePersonalData.hook';
import { useMe } from '@/api/hooks/useMe.hook';
import { Button } from '@/components/ui/button';
import { FormInputError } from '@/components/ui/formInputError';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryKeys } from '@/constants';
import { cn } from '@/lib/utils';

const changePersonalSchema = z.object({
  firstName: z.string().max(15, { message: 'First name is too long' }).nonempty({ message: 'First name is required' }),
  secondName: z.string().nonempty({ message: 'Second name is required' }),
});

export type ChangePersonalValues = z.infer<typeof changePersonalSchema>;

export default function ChangePersonalForm() {
  const { data: user } = useMe();
  const { mutateAsync, isPending, isSuccess } = useChangePersonalData({
    onSuccess: async (data) => {
      try {
        queryClient.setQueryData([QueryKeys.MyAccount], data);
        const { toast } = await import('sonner');
        toast.success('Personal information has been changed');
      } catch (error: any) {
        const message = error.response?.data?.message;
        const { toast } = await import('sonner');
        toast.error(message ?? 'Error while changing personal information');
      }
    },
  });
  const queryClient = useQueryClient();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function onSubmit(values: ChangePersonalValues) {
    await mutateAsync({ ...values });
  }

  const { register, handleSubmit, formState } = useForm<ChangePersonalValues>({
    resolver: zodResolver(changePersonalSchema),
    values: {
      firstName: user?.firstName ?? '',
      secondName: user?.secondName ?? '',
    },
    resetOptions: {
      keepDefaultValues: true,
    },
    defaultValues: {
      firstName: user?.firstName ?? '',
      secondName: user?.secondName ?? '',
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 w-full'>
      <div>
        <label
          htmlFor='firstName'
          className='text-sm font-medium'>
          Email
        </label>
        <Input
          type='text'
          id='firstName'
          disabled={isPending}
          defaultValue={user?.firstName}
          {...register('firstName')}
          aria-invalid={!!formState.errors.firstName}
          placeholder='tony.soprano@jrai.com'
        />
        <FormInputError>{formState.errors.firstName?.message}</FormInputError>
      </div>
      <div>
        <label
          htmlFor='secondName'
          className='text-sm font-medium'>
          Password
        </label>
        <Input
          id='secondName'
          type='text'
          defaultValue={user?.secondName}
          disabled={isPending}
          aria-invalid={!!formState.errors.secondName}
          {...register('secondName')}
        />
        <FormInputError>{formState.errors.secondName?.message}</FormInputError>
      </div>
      <div
        className={cn(
          'flex justify-end transition-all',
          !formState.isValid || !formState.isDirty ? 'opacity-0 h-0' : 'opacity-100 h-auto',
        )}>
        <Button
          type='submit'
          disabled={isPending || !formState.isValid || !formState.isDirty || isSuccess}>
          {isPending ? <LoaderCircle className='animate-spin size-6' /> : isSuccess ? 'Updated!' : 'Update'}
        </Button>
      </div>
    </form>
  );
}
