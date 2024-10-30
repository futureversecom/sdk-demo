'use client';
import React from 'react';

import { ExternalLink } from './Icons';

export function DocumentationLink({
  navName,
  links,
}: {
  navName?: string;
  links: { link: string; title: string }[];
}) {
  return (
    links &&
    links.length > 0 && (
      <div className="documentation-link">
        <ul>
          {links &&
            links.map((link, i) => (
              <li key={`${navName}-docs-link-${i}`}>
                <a href={link.link} target="_blank" rel="noopener noreferrer">
                  <div>{link.title}</div>
                  <ExternalLink />
                </a>
              </li>
            ))}
        </ul>
      </div>
    )
  );
}
