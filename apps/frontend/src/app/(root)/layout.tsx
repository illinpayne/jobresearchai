import Footer from '@/components/root/footer';
import Header from '@/components/root/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id='home'>
      <Header />
      <div className='overflow-x-hidden'>{children}</div>

      <Footer />
    </div>
  );
}
