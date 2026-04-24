'use client';

import { ChevronsUpDown } from 'lucide-react';
import { useMe } from '@/api/hooks/useMe.hook';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { getImage } from '@/lib/utils';
import ProfileContentDropdown from '../profile-dropdown/profile-content-dropdown';
import { AvatarFallback } from './avatar-fallback';

export function NavUser() {
  const { data: user } = useMe();

  if (!user) {
    return <Skeleton className='w-full h-10 rounded-md bg-neutral-300' />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  src={getImage(user?.avatar)}
                  alt={user?.firstName}
                />
                <AvatarFallback initials={`${user.firstName[0]}${user.secondName[0]}`} />
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user?.firstName}</span>
                <span className='truncate text-xs'>{user?.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <ProfileContentDropdown {...user} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
