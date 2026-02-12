import type { Metadata } from 'next';
import { Geist, Montserrat } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { APP_CONFIG, SEO } from '@/constants';
import { TanstackQueryProvider } from '@/providers';

const font = Geist({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-ibm-plex-sans',
});

const montserral = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: {
    absolute: SEO.name,
    template: `%s - ${SEO.name}`,
  },
  description: SEO.description,
  metadataBase: new URL(APP_CONFIG.baseUrl),
  applicationName: SEO.name,
  keywords: SEO.keywords,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/touch-icons/192x192.png',
    other: {
      rel: 'touch-icons',
      url: '/touch-icons/192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: SEO.name,
    description: SEO.description,
    type: 'website',
    emails: ['support@teacoder.ru'],
    siteName: SEO.name,
    locale: 'ru_RU',
    images: [
      {
        url: new URL(APP_CONFIG.baseUrl + '/opengraph.png'),
        width: 512,
        height: 512,
        alt: SEO.name,
      },
    ],
    url: APP_CONFIG.baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.name,
    description: SEO.description,
    images: [
      {
        url: new URL(APP_CONFIG.baseUrl + '/opengraph.png'),
        width: 512,
        height: 512,
        alt: SEO.name,
      },
    ],
  },
  formatDetection: SEO.formatDetection,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning>
      <body className={`${font.className} ${font.variable} ${montserral.variable} antialiased`}>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
