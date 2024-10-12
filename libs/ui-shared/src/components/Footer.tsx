import React from 'react';
import { DocumentationIcon } from './DocumentationIcon';
import { GithubIcon } from './GithubIcon';
import { FVIcon } from './FVIcon';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__nav">
        <div className="footer__nav_icons">
          <a href="https://futureverse.com/" target="_blank" rel="noreferrer">
            <div className="icon">
              <FVIcon />
            </div>
            <div className="icon-text">Futureverse</div>
          </a>
          <a
            href="https://docs.futureverse.com/dev"
            target="_blank"
            rel="noreferrer"
          >
            <div className="icon">
              <DocumentationIcon />
            </div>
            <div className="icon-text">SDK Documentation</div>
          </a>
          <a
            href="https://github.com/futureversecom/sdk-demo/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="icon">
              <GithubIcon />
            </div>
            <div className="icon-text">Github Repo</div>
          </a>
        </div>
      </div>
    </footer>
  );
}
