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
            to="/asset-register/view"
          >
            View Assets
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/asset-register/link"
          >
            Link/Unlink Assets
          </Link>
        </li>
      </ul>
      <DocumentationLink links={assetLinks} navName="assets" />
    </>
  );
};

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
            to="/transact/custom-builder"
          >
            Extrinsic Builder
          </Link>
        </li>
      </ul>
      <DocumentationLink links={transactLinks} navName="transact" />
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
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/evm/erc-20">
            ERC-20
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/evm/erc-721">
            ERC-721
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/evm/erc-1155"
          >
            ERC-1155
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/evm/fee-proxy"
          >
            Fee Proxy
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/evm/futurePass-proxy"
          >
            FuturePass Proxy
          </Link>
        </li>
      </ul>
      <DocumentationLink links={evmLinks} navName="polkadot" />
    </>
  );
};

const TransactionsMenu = ({
  setIsOpen,
}: {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <ul className="">
      <li className="grid cols-2 no-gap dropdown-content-wrapper">
        <div className="col ">
          <div className="subtitle">Native API</div>
          <TransactMenu setIsOpen={setIsOpen} />
        </div>
        <div className="col">
          <div className="subtitle">EVM API</div>
          <EvmMenu setIsOpen={setIsOpen} />
        </div>
      </li>
    </ul>
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
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/auth/ui">
            Auth UI SDK
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen && setIsOpen(false)}
            to="/auth/ui-customiser"
          >
            Auth UI Customiser
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/auth/react">
            Auth React SDK
          </Link>
        </li>
        <li>
          <a
            onClick={() => setIsOpen && setIsOpen(false)}
            href="https://login.futureverse.cloud/manageclients"
            target="_blank"
            rel="nofollow noopener noreferrer"
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

const SwappablesMenu = () => {
  return (
    <>
      <ul className="dropdown-content">
        <li className="no-hover">Demos Coming Soon</li>
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
      <DropDownMenu title="Transactions">
        <TransactionsMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Asset Register">
        <AssetRegisterMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Swappables">
        <SwappablesMenu />
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
        <li>
          <div className="sectionTitle">Auth</div>
          <ul className="dropdown-content">
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink links={authDocLinks} navName="auth" />
        </li>
        <li>
          <div className="sectionTitle">Transact</div>
          <TransactionsMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Asset Register</div>
          <AssetRegisterMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Swappables</div>
          <SwappablesMenu />
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
