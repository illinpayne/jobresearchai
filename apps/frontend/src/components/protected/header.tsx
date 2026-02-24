'use client';

import { Briefcase, Home, SearchCheck, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { ROUTES } from '@/constants';
import { HeaderButton } from '../shared/header-button';
import ProfilePopover from './profile-popover';

const navigation = [
  {
    href: ROUTES.OVERVIEW.DEFAULT,
    title: 'Home',
    icon: <Home />,
  },
  {
    href: ROUTES.OVERVIEW.VACANCIES,
    title: 'Vacancies',
    icon: <Briefcase />,
  },
  {
    href: ROUTES.OVERVIEW.SETTINGS,
    title: 'Settings',
    icon: <Settings />,
  },
];

export default function OverviewHeader() {
  const path = usePathname();

  function isSelectedRoute(href: string, index: number) {
    if (path === href && index === 0) return true;
    if (index !== 0) {
      return path.startsWith(href);
    }
    return false;
  }
  return (
    <header className='sticky top-0 left-0 h-screen flex flex-col items-center gap-8 py-0 bg-neutral-100 border-r px-1'>
      <button className='rounded hover:bg-gray-200 py-2 px-3 transition-all'>
        {/* TODO: Put icon */}
        <SearchCheck size={28} />
      </button>
      <nav className='list-none flex flex-col gap-3'>
        {navigation.map((nav, i) => (
          <HeaderButton
            key={`${nav.title}_${i}`}
            title={nav.title}
            href={nav.href}
            isSelected={isSelectedRoute(nav.href, i)}>
            {nav.icon}
          </HeaderButton>
        ))}
      </nav>
      <div className='w-full py-4 flex flex-col items-center mt-auto'>
        <ProfilePopover />
      </div>
    </header>
  );
}
