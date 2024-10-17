import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import {
  assetLinks,
  authDocLinks,
  DocumentationLink,
  DropDownMenu,
  evmLinks,
  ExternalLink,
  MenuProps,
  Navigation,
  polkadotLinks,
  shortAddress,
  swappablesLinks,
  transactLinks,
} from '@fv-sdk-demos/ui-shared';
import { useAuth, useConnector } from '@futureverse/auth-react';

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
            to="/transact/assets"
          >
            Assets
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/transact/nft"
          >
            NFT
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/transact/sft"
          >
            SFT
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/transact/evm"
          >
            EVM
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/transact/custom"
          >
            Custom
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/transact/batch-all"
          >
            Batch
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/custom-builder"
          >
            Extrinsic Builder
          </Link>
        </li>
      </ul>
      <DocumentationLink links={transactLinks} navName="transact" />
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
      <DropDownMenu title="Polkadot API">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={polkadotLinks} navName="polkadot" />
      </DropDownMenu>
      <DropDownMenu title="EVM">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={evmLinks} navName="polkadot" />
      </DropDownMenu>
      <DropDownMenu title="Auth">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={authDocLinks} navName="auth" />
      </DropDownMenu>
      <DropDownMenu title="Transact">
        <TransactMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Asset Register">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={assetLinks} navName="assets" />
      </DropDownMenu>
      <DropDownMenu title="Swappables">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink links={swappablesLinks} navName="swappables" />
      </DropDownMenu>

      <DropDownMenu
        title={shortAddress(userSession?.futurepass ?? '', 6, 4)}
        buttonClasses="green"
        classes="wallet-dropdown"
      >
        <ul className="dropdown-content">
          <li>
            <Link onClick={() => setIsOpen && setIsOpen(false)} to="/">
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
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/">
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
          <div className="sectionTitle">Polkadot API</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={polkadotLinks} navName="polkadot" />
        </li>
        <li>
          <div className="sectionTitle">EVM</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={evmLinks} navName="polkadot" />
        </li>
        <li>
          <div className="sectionTitle">Auth</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={authDocLinks} navName="auth" />
        </li>
        <li>
          <div className="sectionTitle">Transact</div>
          <TransactMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Asset Register</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={assetLinks} navName="assets" />
        </li>
        <li>
          <div className="sectionTitle">Swappables</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={swappablesLinks} navName="swappables" />
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
