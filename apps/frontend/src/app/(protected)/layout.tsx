import OverviewHeader from '@/components/protected/header';
import { AppSidebar } from '@/components/protected/overview.sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BillingModalProvider } from '@/providers';

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return (
  //   <div className='grid grid-cols-[5rem_1fr] relative *:pt-5'>
  //     <OverviewHeader />
  //     {children}
  //     <BillingModalProvider />
  //   </div>
  // );
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
