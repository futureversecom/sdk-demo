import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useConnector } from '@futureverse/auth-react';

export default function Header() {
  const { userSession, signOut } = useAuth();
  const { disconnect, isConnected } = useConnector();

  console.log('userSession', userSession);
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
          <Link to="/">Account Info</Link>
        </li>
        {userSession && (
          <>
            <li style={{ padding: '0 16px' }}>
              <Link to="/transfer">Transfer Funds</Link>
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
