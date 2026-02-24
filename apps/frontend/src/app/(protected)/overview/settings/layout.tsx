import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update your profile',
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-full mt-4 px-4 py-0!'>
      <div className='flex w-full py-14'>
        <div className='mx-auto flex flex-col gap-4 items-start'>{children}</div>
      </div>
    </div>
  );
}
