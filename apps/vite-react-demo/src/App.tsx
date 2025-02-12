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
  LogoIcon,
  BatchAll,
  EvmErc20,
  EvmErc721,
  EvmErc1155,
  FeeProxy,
  FuturePassProxy,
  AssetLink,
  ViewAssetsComp,
} from '@fv-sdk-demos/ui-shared';
import Login from './components/Login';
import Nav, { MobileMenu } from './components/Nav';
import useIsAuthed from './hooks/useIsAuthed';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home title="Welcome to the Root Network SDK Playground (Vite)" />
          }
        />
        <Route path="/transact/assets" element={<Assets />} />
        <Route path="/transact/batch-all" element={<BatchAll />} />
        <Route path="/transact/custom" element={<Custom />} />
        <Route path="/transact/custom-builder" element={<CustomBuilder />} />
        <Route path="/transact/evm" element={<Evm />} />
        <Route path="/transact/nft" element={<Nft />} />

        <Route path="/evm/erc-20" element={<EvmErc20 />} />
        <Route path="/evm/erc-721" element={<EvmErc721 />} />
        <Route path="/evm/erc-1155" element={<EvmErc1155 />} />
        <Route path="/evm/fee-proxy" element={<FeeProxy />} />
        <Route path="/evm/futurePass-proxy" element={<FuturePassProxy />} />

        <Route path="/asset-register/view" element={<ViewAssetsComp />} />
        <Route path="/asset-register/link" element={<AssetLink />} />

        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile(992);

  useIsAuthed({ redirectUrl: '/' });

  return (
    <div className="body-wrap">
      <div>
        <Header
          Nav={() => <Nav setIsOpen={setIsOpen} isOpen={isOpen} />}
          Logo={() => (
            <div className="header__logo__row">
              <Link to="/">
                <LogoIcon />
              </Link>
              <span className="pill">Porcini</span>
            </div>
          )}
        />
      </div>
      {isOpen && isMobile && <MobileMenu setIsOpen={setIsOpen} />}
      <div className="inner">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
