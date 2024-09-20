import './App.css';
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import {
  Evm,
  Home,
  Transfer,
  Custom,
  Nft,
  CustomBuilder,
} from '@fv-sdk-demos/ui-shared';
import Login from './components/Login';
import Header from './components/Header';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<Home title="Welcome to the SDK Demo in Vite React" />}
        />
        <Route path="assetTx" element={<Transfer />} />
        <Route path="customTx" element={<Custom />} />
        <Route path="CustomBuilder" element={<CustomBuilder />} />
        <Route path="evmTx" element={<Evm />} />
        <Route path="nftTx" element={<Nft />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
