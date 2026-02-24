'use client';

import { Lock, Mail, UserRoundPen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import { NavButton } from './nav-button';

const navigation = [
  {
    title: 'Update personal data',
    href: ROUTES.OVERVIEW.SETTINGS,
    icon: <UserRoundPen className='size-5' />,
  },
  {
    title: 'Change email',
    href: ROUTES.OVERVIEW.ACCOUNT_SETTINGS,
    icon: <Mail className='size-5' />,
  },
  {
    title: 'Recover password',
    href: ROUTES.OVERVIEW.RECOVER_PASSWORD_SETTINGS,
    icon: <Lock className='size-5' />,
  },
];

export default function AccountSettingsSidebar() {
  const path = usePathname();
  return (
    <div className='bg-white-200 border-b-4 border-b-gray-400/10 p-4 rounded-lg flex flex-col w-80'>
      <h2 className='text-lg mb-4 text-blue-900 font-semibold'>Settings</h2>
      <nav>
        {navigation.map((nav, i) => (
          <NavButton
            key={`${nav.title}_{i}`}
            href={nav.href}
            icon={nav.icon}
            isSelected={path === nav.href}>
            {nav.title}
          </NavButton>
        ))}
      </nav>
    </div>
  );
}
