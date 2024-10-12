import React from 'react';
import { DocumentationIcon } from './DocumentationIcon';
import { GithubIcon } from './GithubIcon';

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
        <div className="header__nav_icons">
          <a
            href="https://docs.futureverse.com/dev"
            target="_blank"
            rel="noreferrer"
          >
            <DocumentationIcon />
          </a>
          <a
            href="https://github.com/futureversecom/sdk-demo/"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon />
          </a>
        </div>
      </div>
    </header>
  );
}
