import type { Metadata } from 'next';
import AccountSettingsSidebar from '@/components/protected/accounts/settings-sidebar';

export const metadata: Metadata = {
  title: 'Vacancies',
};

export default function VacanciesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='grid grid-cols-[auto_1fr] relative py-0!'>
      <div className='sticky top-0 left-0 h-screen w-max pt-4 ml-4'>
        <AccountSettingsSidebar />
      </div>
      <div className='w-full mt-4 px-4'>
        <div className='flex w-full'>
          <div className='mx-auto mt-14 flex flex-col gap-4 items-start'>{children}</div>
        </div>
      </div>
    </div>
  );
}
