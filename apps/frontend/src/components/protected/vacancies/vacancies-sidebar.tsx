'use client';

import { SquareUserRound, UserRoundPen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NavButton } from '../accounts/nav-button';

export default function VacanciesSidebar() {
  const path = usePathname();
  return (
    <div className='w-80 sticky top-0 h-screen bg-white-200 border-r p-4 flex flex-col'>
      <h2 className='uppercase font-medium text-sm mb-4'>Filters</h2>
      <NavButton
        href={'/overview'}
        icon={<UserRoundPen className='size-5' />}>
        Human data
      </NavButton>
      <NavButton
        href={'/overview'}
        icon={<SquareUserRound className='size-5' />}>
        Account data
      </NavButton>
    </div>
  );
}
