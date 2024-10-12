import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import {
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
    <ul className="dropdown-content">
      <li>
        <Link onClick={() => setIsOpen && setIsOpen(false)} to="/assetTx">
          Assets Class
        </Link>
      </li>
      <li>
        <Link onClick={() => setIsOpen && setIsOpen(false)} to="/nftTx">
          NFT Class
        </Link>
      </li>
      <li>
        <Link onClick={() => setIsOpen && setIsOpen(false)} to="/evmTx">
          EVM Class
        </Link>
      </li>
      <li>
        <Link onClick={() => setIsOpen && setIsOpen(false)} to="/customTx">
          Custom Class
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
          <li>Coming Soon</li>
        </ul>
      </DropDownMenu>
      <DropDownMenu title="Transact SDK">
        <TransactMenu setIsOpen={setIsOpen} />
      </DropDownMenu>
      <DropDownMenu title="Asset Register SDK">
        <ul className="dropdown-content">
          <li>Coming Soon</li>
        </ul>
      </DropDownMenu>
      <DropDownMenu title="Swappables SDK">
        <ul className="dropdown-content">
          <li>Coming Soon</li>
        </ul>
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
            <li>Coming Soon</li>
          </ul>
        </li>
        <li>
          <div className="sectionTitle">Transact SDK</div>
          <TransactMenu setIsOpen={setIsOpen} />
        </li>
        <li>
          <div className="sectionTitle">Asset Register SDK</div>
          <ul>
            <li>Coming Soon</li>
          </ul>
        </li>
        <li>
          <div className="sectionTitle">Swappables SDK</div>
          <ul>
            <li>Coming Soon</li>
          </ul>
        </li>
        <LogOut />
      </ul>
    </div>
  );
};
