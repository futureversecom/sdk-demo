import './App.css';
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import { Evm, Home, Transfer, Custom } from '@fv-sdk-demos/ui-shared';
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
        <Route path="assets" element={<Transfer />} />
        <Route path="custom" element={<Custom />} />
        <Route path="evm" element={<Evm />} />
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
