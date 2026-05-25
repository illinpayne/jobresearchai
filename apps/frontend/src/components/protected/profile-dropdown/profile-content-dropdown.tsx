/** biome-ignore-all lint/complexity/noUselessFragments: <explanation> */
'use client';

import type { AccountResponse } from '@/api/generated';
import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';
import { getImage } from '@/lib/utils';
import { Pyramid, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AvatarFallback } from '../overview-sidebar/avatar-fallback';
import LogoutButton from '../overview-sidebar/logout.button';

export default function ProfileContentDropdown(user: AccountResponse | undefined) {
  const router = useRouter();
  const { onOpen } = useBillingDialog();
  const { data: sub } = useCurrentSubscription();

  if (!user) {
    return <Skeleton className='size-10 rounded-md bg-neutral-300' />;
  }

  return (
    <DropdownMenuContent
      className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
      side='bottom'
      align='end'
      sideOffset={4}>
      <DropdownMenuLabel
        className='p-0 font-normal cursor-pointer hover:bg-neutral-100'
        onClick={() => {
          router.push(ROUTES.OVERVIEW.DEFAULT);
        }}>
        <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage
              src={getImage(user?.avatar)}
              alt={user?.firstName}
            />
            <AvatarFallback initials={`${user.firstName[0]}${user.secondName[0]}`} />
          </Avatar>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-medium'>
              {user?.firstName} {user?.secondName}
            </span>
            <span className='truncate text-xs'>
              {user?.email} • {sub?.plan.name !== 'Free' && sub?.plan.name}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {sub ? (
          <>
            {sub.plan.name === 'Free' && (
              <DropdownMenuItem onClick={() => onOpen()}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => router.push(ROUTES.OVERVIEW.USAGE)}>
              <Pyramid />
              {sub?.credits ?? 0} tokens
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => onOpen()}>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {/* <DropdownMenuGroup>
        <DropdownMenuItem>
          <Bell />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator /> */}
      <DropdownMenuItem>
        <LogoutButton />
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
