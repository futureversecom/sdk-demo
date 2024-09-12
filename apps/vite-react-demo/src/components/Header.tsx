import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useConnector } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';

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
              <Link to="/">Account Info</Link>
            </li>
            <li style={{ padding: '0 16px' }}>
              <Link to="/assets">Assets</Link>
            </li>
            <li style={{ padding: '0 16px' }}>
              <Link to="/custom">Custom</Link>
            </li>
            <li style={{ padding: '0 16px' }}>
              <Link to="/evm">EVM</Link>
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
