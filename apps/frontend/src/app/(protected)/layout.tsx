import OverviewHeader from '@/components/protected/header';
import { BillingModalProvider } from '@/providers';

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='grid grid-cols-[5rem_1fr] relative *:pt-5'>
      <OverviewHeader />
      {children}
      <BillingModalProvider />
    </div>
  );
}
