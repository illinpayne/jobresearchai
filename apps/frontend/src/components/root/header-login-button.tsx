'use client';

import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook'
import { useMe } from '@/api/hooks/useMe.hook'
import { ROUTES } from '@/constants'
import { useRouter } from 'next/navigation'
import ProfileDropdown from '../protected/profile-dropdown/profile-dropdown'
// import ProfilePopover from '../protected/profile-popover';
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

export default function HeaderLoginButton() {
  const { data: user, isLoading } = useMe();
  const { data: sub } = useCurrentSubscription();
  const router = useRouter();

  if (isLoading) {
    return <Skeleton className='h-10 w-30' />;
  }

  if (user) {
    return (
      <div className='flex gap-6 items-center'>
        {sub && sub.plan.name === 'Free' && (
          <Button
            variant={'outline'}
            className='border-secondary text-secondary rounded-xs hover:bg-secondary hover:text-white'
            onClick={() => {
              router.push(ROUTES.PRICING);
            }}>
            Upgrade plan
          </Button>
        )}
        <ProfileDropdown {...user} />
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
