import type { Metadata } from 'next';

import './globals.css';

import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/Providers';

import { headers } from 'next/headers';
import { getWagmiConfig } from '@/Providers/config';
import { cookieToInitialState } from 'wagmi';
import { HeaderWrap } from '@/components/HeaderWrap';
import FooterWrap from '@/components/FooterWrap';

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
          <div className="body-wrap">
            <HeaderWrap />
            <div className="inner">{children}</div>
            <FooterWrap />
          </div>
        </Providers>
      </body>
    </html>
  );
}
