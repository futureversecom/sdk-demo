import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentationLink,
  DropDownMenu,
  LogOut,
  MenuProps,
  Navigation,
} from '@fv-sdk-demos/ui-shared';

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
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/assetTx">
            Assets
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/nftTx">
            NFT
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/evmTx">
            EVM
          </Link>
        </li>
        <li>
          <Link onClick={() => setIsOpen && setIsOpen(false)} to="/customTx">
            Custom
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
      <DocumentationLink link="https://docs.futureverse.com/dev/transact" />
    </>
  );
};

export const Menu: React.FC<MenuProps> = ({ setIsOpen }) => {
  return (
    <>
      <li>
        <Link onClick={() => setIsOpen && setIsOpen(false)} to="/">
          Account Info
        </Link>
      </li>

      <DropDownMenu title="Auth SDK">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink link="https://docs.futureverse.com/dev/auth" />
      </DropDownMenu>
      <DropDownMenu title="Transact SDK">
        <TransactMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Asset Register SDK">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink link="https://docs.futureverse.com/dev/assets" />
      </DropDownMenu>
      <DropDownMenu title="Swappables SDK">
        <ul className="dropdown-content">
          <li className="no-hover">Coming Soon</li>
        </ul>
        <DocumentationLink link="https://docs.futureverse.com/dev/platform-tools/swappables-engine" />
      </DropDownMenu>
    </>
  );
};

export const MobileMenu: React.FC<MenuProps> = ({ setIsOpen }) => {
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
          <div className="sectionTitle">Auth SDK</div>
          <ul>
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink link="https://docs.futureverse.com/dev/auth" />
        </li>
        <li>
          <div className="sectionTitle">Transact SDK</div>
          <TransactMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Asset Register SDK</div>
          <ul>
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink link="https://docs.futureverse.com/dev/assets" />
        </li>
        <li>
          <div className="sectionTitle">Swappables SDK</div>
          <ul>
            <li className="no-hover">Coming Soon</li>
          </ul>
          <DocumentationLink link="https://docs.futureverse.com/dev/platform-tools/swappables-engine" />
        </li>
        <LogOut />
      </ul>
    </div>
  );
};
