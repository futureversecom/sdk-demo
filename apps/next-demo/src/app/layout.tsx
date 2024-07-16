import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header';
import { Providers } from '@/client-components';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
