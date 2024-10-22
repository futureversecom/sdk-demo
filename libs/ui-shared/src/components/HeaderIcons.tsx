import React from 'react';
import { DocumentationIcon } from './Icons/DocumentationIcon';
import { GithubIcon } from './Icons/GithubIcon';
import { DarkModeToggle } from './DarkModeToggle';

export function HeaderIcons() {
  return (
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
      <DarkModeToggle />
    </div>
  );
}
