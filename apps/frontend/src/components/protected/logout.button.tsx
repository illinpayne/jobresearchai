'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/api/hooks/useLogout.hook';
import { Button } from '@/components/ui/button';
import { cleanSession } from '@/lib/client/session-persist';

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: logoutAsync, isPending } = useLogout({
    onSuccess() {
      cleanSession(queryClient);
      router.push('/signin');
    },
    async onError(error: any) {
      const message = error.response?.data?.message;
      const { toast } = await import('sonner');
      toast.error(message ?? 'Cannot sign out');
    },
  });

  async function logout() {
    cleanSession(queryClient);
    await logoutAsync();
  }

  return (
    <Button
      variant={'outline'}
      disabled={isPending}
      className='hover:bg-red-500/10 hover:border-red-500/60'
      onClick={async () => await logout()}>
      Sign out
    </Button>
  );
}
