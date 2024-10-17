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
  title: 'Futureverse SDKs: Next Demo',
  description: 'Futureverse SDKs: Next Demo',
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
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-48x48.png"
          sizes="48x48"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Futureverse SDK Demo"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
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
