'use client';

import type { AccountResponse } from '@/api/generated';
import { getImage } from '@/lib/utils';
import { Avatar, AvatarImage } from '../../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Skeleton } from '../../ui/skeleton';
import { AvatarFallback } from '../overview-sidebar/avatar-fallback';
import ProfileContentDropdown from './profile-content-dropdown';

export default function ProfileDropdown(user: AccountResponse | undefined) {
  if (!user) {
    return <Skeleton className='size-10 rounded-md bg-neutral-300' />;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer'>
          <Avatar className='size-9 rounded-lg'>
            <AvatarImage
              src={getImage(user?.avatar)}
              alt={user?.firstName}
            />
            <AvatarFallback initials={`${user.firstName[0]}${user.secondName[0]}`} />
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <ProfileContentDropdown {...user} />
    </DropdownMenu>
  );
}
