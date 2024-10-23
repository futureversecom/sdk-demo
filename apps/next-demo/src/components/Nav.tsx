'use client';

import { useAuth, useConnector } from '@futureverse/auth-react';
import {
  assetLinks,
  authDocLinks,
  DocumentationLink,
  DropDownMenu,
  MenuProps,
  Navigation,
  ResourceMenu,
  ResourceMenuMobile,
  shortAddress,
  swappablesLinks,
  transactLinks,
} from '@fv-sdk-demos/ui-shared';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';

export default function Nav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Navigation Menu={Menu} isMobileOpen={isOpen} setIsMobileOpen={setIsOpen} />
  );
}

const TransactMenu = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <ul className="dropdown-content">
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} href="/assets">
            Assets
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} href="/nft">
            NFT
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} href="/evm">
            EVM
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} href="/custom">
            Custom
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} href="/batchall">
            Batch
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/custom-builder"
          >
            Extrinsic Builder
          </Link>
        </li>
      </ul>
      <DocumentationLink links={transactLinks} navName="transact" />
    </>
  );
};

const AssetRegisterMenu = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <ul className="dropdown-content">
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/asset-link-equip"
          >
            Asset Link Equip
          </Link>
        </li>
      </ul>
      <DocumentationLink links={assetLinks} navName="assets" />
    </>
  );
};

export const Menu: React.FC<MenuProps> = ({ setIsOpen }) => {
  const { signOut, userSession } = useAuth();
  const { disconnect, isConnected } = useConnector();

  return (
    <>
      <DropDownMenu title="Auth SDK">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={authDocLinks} navName="auth" />
      </DropDownMenu>
      {/* <DropDownMenu title="Polkadot SDK">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={polkadotLinks} navName="polkadot" />
      </DropDownMenu> */}
      <DropDownMenu title="Transact SDK">
        <TransactMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Asset Register SDK">
        <AssetRegisterMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Swappables SDK">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={swappablesLinks} navName="swappables" />
      </DropDownMenu>
      <ResourceMenu />

      <DropDownMenu
        title={shortAddress(userSession?.futurepass ?? '', 6, 4)}
        buttonClasses="green"
        classes="wallet-dropdown"
      >
        <ul className="dropdown-content">
          <li>
            <Link onClick={() => setIsOpen && setIsOpen(false)} href="/">
              Account Info
            </Link>
          </li>
          <li className="wallet-dropdown-inner">
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
        </ul>
      </DropDownMenu>
    </>
  );
};

export const MobileMenu: React.FC<MenuProps> = ({ setIsOpen }) => {
  const { signOut } = useAuth();
  const { disconnect, isConnected } = useConnector();

  return (
    <div className="mobile-container-outer">
      <div className="close" onClick={() => setIsOpen && setIsOpen(false)}>
        Close Menu
      </div>
      <ul className="mobile-container">
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} href="/">
            Account Info
          </Link>
        </li>
        <li>
          <div className="sectionTitle">Auth SDK</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={authDocLinks} navName="auth" />
        </li>
        {/* <li>
          <div className="sectionTitle">Polkadot SDK</div>
                  <ul className="dropdown-content">

            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={polkadotLinks} navName="polkadot" />
        </li> */}
        <li>
          <div className="sectionTitle">Transact SDK</div>
          <TransactMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Asset Register SDK</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={assetLinks} navName="assets" />
        </li>
        <li>
          <div className="sectionTitle">Swappables SDK</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={swappablesLinks} navName="swappables" />
        </li>
        <li>
          <ResourceMenuMobile />
        </li>
        <li>
          <div className="wallet-dropdown-inner">
            <button
              onClick={() => {
                isConnected && disconnect();
                signOut({ flow: 'redirect' });
              }}
              className="green"
            >
              Log Out
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};
