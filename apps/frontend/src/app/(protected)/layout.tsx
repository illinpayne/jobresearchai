import { OverviewSidebar } from '@/components/protected/overview-sidebar/overview.sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BillingModalProvider } from '@/providers';

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider open>
      <OverviewSidebar />
      <main className='w-full'>
        {children}
        <BillingModalProvider />
      </main>
    </SidebarProvider>
  );
}
