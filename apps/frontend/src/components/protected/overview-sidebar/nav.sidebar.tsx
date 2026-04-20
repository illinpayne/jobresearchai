'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface Props {
  data: {
    name: string;
    url: string;
    icon: any;
  }[];
  title?: string;
}

export function SidebarSection({ data, title }: Props) {
  const path = usePathname();

  function isSelectedRoute(href: string, index: number) {
    if (path === href && index === 0) return true;
    if (index !== 0) {
      return path.startsWith(href);
    }
    return false;
  }

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {data.map((item, i) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn(isSelectedRoute(item.url, i) && 'bg-neutral-200 hover:bg-neutral-200')}>
              <Link href={item.url}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
