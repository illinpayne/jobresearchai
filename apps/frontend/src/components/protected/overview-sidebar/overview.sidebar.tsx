'use client';

import { ArrowLeft, Bot, BriefcaseBusiness, CircleUserRound, CreditCard, Files, PlusCircle, Settings, Zap } from 'lucide-react';
import { ApplicationName } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from '../../ui/sidebar';
import { SidebarSection } from './nav.sidebar';
import { NavUser } from './user.sidebar';

const lih = [
  {
    name: 'New resume',
    url: ROUTES.OVERVIEW.NEW_RESUME,
    icon: <PlusCircle />,
  },
  {
    name: 'AI Models',
    url: ROUTES.OVERVIEW.AI,
    icon: <Bot />,
  },
  {
    name: 'Back',
    url: '/#',
    icon: <ArrowLeft />,
  },
];

const workflow = [
  {
    name: 'Your resumes',
    url: ROUTES.OVERVIEW.RESUMES,
    icon: <Files />,
  },
  {
    name: 'Found jobs',
    url: ROUTES.OVERVIEW.FOUND_JOBS,
    icon: <BriefcaseBusiness />,
  },
];

const account = [
  {
    name: 'Usage',
    url: '/overview/billing',
    icon: <Zap />,
  },
  {
    name: 'Subscriptions',
    url: '/overview/billing',
    icon: <CreditCard />,
  },
  {
    name: 'Settings',
    url: ROUTES.OVERVIEW.SETTINGS,
    icon: <Settings />,
  },
];

export function OverviewSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='flex'>
              <h1 className={cn('text-3xl font-borel font-medium transition-all select-none')}>{ApplicationName}</h1>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='pt-2'>
        <SidebarSection
          data={lih}
          title='Let it happen'
        />
        <SidebarSection
          data={workflow}
          title='Workflow'
        />
        <SidebarSection
          data={account}
          title='Accounting'
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
