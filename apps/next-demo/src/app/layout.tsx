import type { Metadata } from 'next';

import './globals.css';

import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/Providers';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Futureverse Sdks: React Demo',
  description: 'Futureverse Sdks: React Demo',
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
