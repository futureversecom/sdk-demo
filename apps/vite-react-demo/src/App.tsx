import './App.css';
import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';

import {
  Evm,
  Home,
  Assets,
  Custom,
  Nft,
  CustomBuilder,
  Header,
  useIsMobile,
  Footer,
} from '@fv-sdk-demos/ui-shared';
import Login from './components/Login';
import Nav, { MobileMenu } from './components/Nav';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<Home title="Welcome to the SDK Demo in Vite React" />}
        />
        <Route path="assetTx" element={<Assets />} />
        <Route path="customTx" element={<Custom />} />
        <Route path="custom-builder" element={<CustomBuilder />} />
        <Route path="evmTx" element={<Evm />} />
        <Route path="nftTx" element={<Nft />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  console.log('isMobile', isMobile);

  return (
    <div className="body-wrap">
      <Header
        Nav={() => <Nav setIsOpen={setIsOpen} isOpen={isOpen} />}
        Logo={() => (
          <Link to="/">
            <img src="/images/FvLogo.svg" alt="Logo" />
          </Link>
        )}
      />
      {isOpen && isMobile && <MobileMenu setIsOpen={setIsOpen} />}
      <div className="inner">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
