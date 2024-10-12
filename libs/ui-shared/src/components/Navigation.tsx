import { useAuth, useConnector } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';
import React, { Dispatch, SetStateAction } from 'react';

export interface MenuProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  openByDefault?: boolean;
}

export function Navigation({
  Menu,
  isMobileOpen,
  setIsMobileOpen,
}: {
  Menu: React.FC<MenuProps>;
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { userSession } = useAuth();

  return (
    <div role="navigation">
      <ul className="desktop-nav ">
        {!userSession && <LogIn />}
        {userSession && (
          <>
            <Menu setIsOpen={setIsMobileOpen} />
            <LogOut />
          </>
        )}
      </ul>
      <ul className="mobile-nav">
        {!userSession && <LogIn />}
        {userSession && (
          <li className="mobile-wrap">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="green"
            >
              Menu
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export const LogIn = () => {
  const { openLogin } = useAuthUi();

  return (
    <button onClick={() => openLogin()} className="green">
      Log In
    </button>
  );
};

export const LogOut = () => {
  const { signOut } = useAuth();
  const { disconnect, isConnected } = useConnector();
  return (
    <li>
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
  );
};
