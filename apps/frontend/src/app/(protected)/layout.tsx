import { OverviewSidebar } from '@/components/protected/overview-sidebar/overview.sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider open>
      <OverviewSidebar />
      <main className='w-full'>{children}</main>
    </SidebarProvider>
  );
}
