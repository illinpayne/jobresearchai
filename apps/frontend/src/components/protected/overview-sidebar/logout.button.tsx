'use client';

import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/api/hooks/useLogout.hook';
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
    <button
      className='flex items-center gap-2 cursor-pointer w-full'
      disabled={isPending}
      onClick={async () => await logout()}>
      <LogOut />
      Sign out
    </button>
  );
}
