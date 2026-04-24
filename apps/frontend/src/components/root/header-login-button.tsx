'use client';

import { useRouter } from 'next/navigation';
import { useMe } from '@/api/hooks/useMe.hook';
import ProfileDropdown from '../protected/profile-dropdown/profile-dropdown';
// import ProfilePopover from '../protected/profile-popover';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export default function HeaderLoginButton() {
  const { data: user, isLoading } = useMe();
  const router = useRouter();

  if (isLoading) {
    return <Skeleton className='h-10 w-30' />;
  }

  if (user) {
    return (
      <div className='flex gap-6 items-center'>
        <Button
          variant={'outline'}
          className='border-secondary text-secondary rounded-xs hover:bg-secondary hover:text-white'>
          Upgrade plan
        </Button>
        <ProfileDropdown {...user} />
        {/* <ProfilePopover
          side='bottom'
          classSide='translate-y-2'
        /> */}
      </div>
    );
  }

  return (
    <div className='flex gap-6 items-center'>
      <Button
        variant={'ghost'}
        className='border-secondary rounded-xs'
        onClick={() => {
          router.push('/signin');
        }}>
        Login
      </Button>
    </div>
  );
}
