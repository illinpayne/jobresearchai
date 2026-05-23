import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import UsageDataWrapper from './data-wrapper';

export const metadata: Metadata = {
  title: 'Your usage',
};

export default function UsagePage() {
  return (
    <div className='min-h-screen bg-gray-50 text-foreground'>
      <div className='mx-auto max-w-4xl px-6 py-10 space-y-6'>
        <nav className='flex items-center gap-1.5 text-sm text-muted-foreground'>
          <Link
            href={ROUTES.OVERVIEW.NEW_RESUME}
            className='hover:text-foreground transition-colors'>
            New analyse
          </Link>
          <span>/</span>
          <span className='text-foreground font-medium'>Usage</span>
        </nav>
        <UsageDataWrapper />
      </div>
    </div>
  );
}
