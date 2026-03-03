/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Simply for redirection */
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/api/hooks/useMe.hook';
import { refetchSession } from '@/lib/client/session-persist';

interface Props {
  token: string;
}

export default function AuthenticationLoader({ token }: Props) {
  const { refetch, isPending, isLoading } = useMe({ enabled: false, retry: false });
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const isSuccess = await refetchSession({
        accessToken: token,
        queryClient,
        refetch,
      });
      if (isSuccess) {
        router.push('/overview');
      }
    };

    initializeAuth();
  }, [token, refetch, router, queryClient]);

  return (
    <div className='h-screen flex justify-center items-center bg-white-200'>
      <div className='mx-auto flex flex-col items-center gap-4'>
        <h2 className='text-2xl font-semibold'>Successfully autheticated!</h2>
        {isLoading || isPending ? <p>Getting the account data, please wait...</p> : <p>Done</p>}
      </div>
    </div>
  );
}
