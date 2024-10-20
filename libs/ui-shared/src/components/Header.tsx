import React from 'react';
import { HeaderIcons } from './HeaderIcons';

export function Header({ Nav, Logo }: { Nav: React.FC; Logo: React.FC }) {
  return (
    <header className="header">
      <div className="header__logo">
        <Logo />
      </div>
      <div className="header__nav">
        <nav>
          <Nav />
        </nav>
        <div className="header__nav__desktop">
          <HeaderIcons />
        </div>
      </div>
    </header>
  );
}
