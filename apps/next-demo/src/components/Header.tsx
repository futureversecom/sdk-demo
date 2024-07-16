'use client';

import { useAuth, useConnector } from '@futureverse/auth-react';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  const { userSession, signOut } = useAuth();
  const { disconnect, isConnected } = useConnector();

  return (
    <div role="navigation">
      <ul
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-start',
          listStyleType: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        <li style={{}}>
          <Link href="/">Account Info</Link>
        </li>
        {userSession && (
          <>
            <li style={{ padding: '0 16px' }}>
              <Link href="/transfer">Transfer Funds</Link>
            </li>
            <li
              style={{
                padding: '0 16px',
                marginLeft: 'auto',
                marginRight: '0',
              }}
            >
              <button
                onClick={() => {
                  isConnected && disconnect();
                  signOut({ flow: 'redirect' });
                }}
                className="green"
              >
                Log Out
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
