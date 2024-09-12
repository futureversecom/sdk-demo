import { useAuth, useConnector } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';
import { Link } from 'react-router-dom';
import React, { Dispatch, SetStateAction, useState } from 'react';

export default function Header() {
  const { userSession } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div role="navigation">
      <ul className="desktop-nav">
        {!userSession && <LogIn />}
        {userSession && (
          <>
            <Menu setIsOpen={setIsOpen} />
            <LogOut />
          </>
        )}
      </ul>
      <ul className="mobile-nav">
        {!userSession && <LogIn />}
        {userSession && (
          <>
            <li className="mobile-wrap" onClick={() => setIsOpen(!isOpen)}>
              Menu
              {isOpen && (
                <ul className="mobile-container">
                  <Menu setIsOpen={setIsOpen} />
                </ul>
              )}
            </li>
            <LogOut />
          </>
        )}
      </ul>
    </div>
  );
}

const LogIn = () => {
  const { openLogin } = useAuthUi();

  return (
    <button onClick={() => openLogin()} className="green">
      Log In
    </button>
  );
};

const LogOut = () => {
  const { signOut } = useAuth();
  const { disconnect, isConnected } = useConnector();
  return (
    <li
      style={{
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
  );
};

interface MenuProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Menu: React.FC<MenuProps> = ({ setIsOpen }) => {
  return (
    <>
      <li>
        <Link onClick={() => setIsOpen(false)} to="/">
          Account Info
        </Link>
      </li>
      <li>
        <Link onClick={() => setIsOpen(false)} to="/assetTx">
          Assets
        </Link>
      </li>
      <li>
        <Link onClick={() => setIsOpen(false)} to="/nftTx">
          NFT
        </Link>
      </li>
      <li>
        <Link onClick={() => setIsOpen(false)} to="/evmTx">
          EVM
        </Link>
      </li>
      <li>
        <Link onClick={() => setIsOpen(false)} to="/customTx">
          Custom
        </Link>
      </li>
    </>
  );
};
