'use client';

import { useAuth, useConnector } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  const { userSession, signOut } = useAuth();
  const { disconnect, isConnected } = useConnector();
  const { openLogin } = useAuthUi();

  return (
    <div role="navigation">
      <ul
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          listStyleType: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {!userSession && (
          <button onClick={() => openLogin()} className="green">
            Log In
          </button>
        )}
        {userSession && (
          <>
            <li style={{ padding: '0 16px', paddingLeft: '0' }}>
              <Link href="/">Account Info</Link>
            </li>
            <li style={{ padding: '0 16px' }}>
              <Link href="/assets">Assets</Link>
            </li>
            <li style={{ padding: '0 16px' }}>
              <Link href="/nft">NFT</Link>
            </li>
            <li style={{ padding: '0 16px' }}>
              <Link href="/evm">EVM</Link>
            </li>
            <li style={{ padding: '0 16px' }}>
              <Link href="/custom">Custom</Link>
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
