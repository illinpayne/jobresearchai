export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header className='sticky h-13 bg-gray-200'></header>
      {children}
      <footer className='h-96 bg-gray-200'></footer>
    </div>
  );
}
