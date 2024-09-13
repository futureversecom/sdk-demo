import type { Metadata } from 'next';

import './globals.css';

import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/Providers';
import Header from '@/components/Header';

import { headers } from 'next/headers';
import { getWagmiConfig } from '@/Providers/config';
import { cookieToInitialState } from 'wagmi';

export const metadata: Metadata = {
  title: 'Futureverse Sdks: Next Demo',
  description: 'Futureverse Sdks: Next Demo',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getWagmiConfig();
  const initialState = cookieToInitialState(config, headers().get('cookie'));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers initialWagmiState={initialState}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
