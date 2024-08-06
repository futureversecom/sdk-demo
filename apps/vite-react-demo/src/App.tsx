import './App.css';
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import { Home, Transfer } from '@fv-sdk-demos/ui-shared';
import Login from './components/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<Home title="Welcome to the SDK Demo in Vite React" />}
        />
        <Route path="transfer" element={<Transfer />} />
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
