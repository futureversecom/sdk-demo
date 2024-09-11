import type { MetaFunction } from '@remix-run/node';
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import styles from '../styles/app.css';
import { Providers } from './components';
import Header from './components/Header';

//example copied from Remix docs
export async function loader() {
  return json({ ENV: { VARIABLE: process.env.VARIABLE } });
}

export const meta: MetaFunction = () => [
  {
    title: 'Futureverse Sdks: Remix Demo',
  },
];

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
}

export default function App() {
  const data: { ENV?: unknown } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: data.ENV,
            })}`,
          }}
        />
        <Providers>
          <Header />
          <Outlet />
        </Providers>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
