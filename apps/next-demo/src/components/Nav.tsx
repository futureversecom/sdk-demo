'use client';

import { useAuth, useConnector } from '@futureverse/auth-react';
import {
  assetLinks,
  authDocLinks,
  DocumentationLink,
  DropDownMenu,
  evmLinks,
  ExternalLink,
  HeaderIcons,
  MenuProps,
  Navigation,
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
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/transact/assets"
          >
            Assets
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/transact/nft"
          >
            NFT
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/transact/sft"
          >
            SFT
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/transact/evm"
          >
            EVM
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/transact/custom"
          >
            Custom
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/transact/batch-all"
          >
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
            href="/asset-link"
          >
            Asset Link
          </Link>
        </li>
      </ul>
      <DocumentationLink links={assetLinks} navName="assets" />
    </>
  );
};

const EvmMenu = ({
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
            href="/evm/erc-20"
          >
            ERC-20
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/evm/erc-721"
          >
            ERC-721
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/evm/erc-1155"
          >
            ERC-1155
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/evm/fee-proxy"
          >
            Fee Proxy
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/evm/futurePass-proxy"
          >
            FuturePass Proxy
          </Link>
        </li>
      </ul>
      <DocumentationLink links={evmLinks} navName="polkadot" />
    </>
  );
};

const AuthMenu = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <ul className="dropdown-content">
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} href="/auth/ui">
            Auth UI SDK
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/auth/ui-customiser"
          >
            Auth UI Customiser
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            href="/auth/react"
          >
            Auth React SDK
          </Link>
        </li>
        <li>
          <a
            onClick={() => setIsOpen && setIsOpen(false)}
            href="https://login.futureverse.cloud/manageclients"
            target="_blank"
            rel="nofollow"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}
          >
            Manage Clients{' '}
            <ExternalLink
              styles={{ width: '16px', height: '16px', marginLeft: '6px' }}
            />
          </a>
        </li>
      </ul>
      <DocumentationLink links={authDocLinks} navName="auth" />
    </>
  );
};

const SwappablesMenu = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <ul className="dropdown-content">
        <li>
          <a
            onClick={() => setIsOpen && setIsOpen(false)}
            href="https://partybear.futurepass.futureverse.app/?tokenId="
            target="_blank"
            rel="nofollow"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}
          >
            Party Bear{' '}
            <ExternalLink
              styles={{ width: '16px', height: '16px', marginLeft: '6px' }}
            />
          </a>
        </li>
        <li>
          <a
            onClick={() => setIsOpen && setIsOpen(false)}
            href="https://raicers.futurepass.futureverse.app/?tokenId="
            target="_blank"
            rel="nofollow"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}
          >
            Party Bear{' '}
            <ExternalLink
              styles={{ width: '16px', height: '16px', marginLeft: '6px' }}
            />
          </a>
        </li>
      </ul>
      <DocumentationLink links={swappablesLinks} navName="swappables" />
    </>
  );
};
export const Menu: React.FC<MenuProps> = ({ setIsOpen }) => {
  const { signOut, userSession } = useAuth();
  const { disconnect, isConnected } = useConnector();

  return (
    <>
      <li>
        <a
          href="https://faucet.rootnet.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="faucet-link"
        >
          <div>Faucet</div>
          <ExternalLink />
        </a>
      </li>
      <li>
        <a
          href="https://portal.rootnet.live/"
          target="_blank"
          rel="noopener noreferrer"
          className="faucet-link"
        >
          <div>Portal</div>
          <ExternalLink />
        </a>
      </li>
      <DropDownMenu title="Auth">
        <AuthMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      {/* <DropDownMenu title="Polkadot API">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={polkadotLinks} navName="polkadot" />
      </DropDownMenu> */}
      <DropDownMenu title="EVM">
        <EvmMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Transact">
        <TransactMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Asset Register SDK">
        <AssetRegisterMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Swappables">
        <SwappablesMenu setIsOpen={setIsOpen} />
      </DropDownMenu>

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
      <div className="header-icon-wrap">
        <HeaderIcons />
      </div>
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
          <a
            href="https://faucet.rootnet.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="faucet-link"
          >
            <div>Faucet</div>
            <ExternalLink />
          </a>
        </li>
        <li>
          <a
            href="https://portal.rootnet.live/"
            target="_blank"
            rel="noopener noreferrer"
            className="faucet-link"
          >
            <div>Portal</div>
            <ExternalLink />
          </a>
        </li>
        <li>
          <div className="sectionTitle">Auth SDK</div>
          <AuthMenu setIsOpen={setIsOpen} />
        </li>
        {/* <li>
          <div className="sectionTitle">Polkadot API</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={polkadotLinks} navName="polkadot" />
        </li> */}
        <li>
          <div className="sectionTitle">EVM</div>
          <EvmMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Transact</div>
          <TransactMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Asset Register SDK</div>
          <AssetRegisterMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Swappables</div>
          <SwappablesMenu setIsOpen={setIsOpen} />
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
