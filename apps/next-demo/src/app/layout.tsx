import type { Metadata } from 'next';

import './globals.css';

import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/Providers';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Futureverse Sdks: Next Demo',
  description: 'Futureverse Sdks: Next Demo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
