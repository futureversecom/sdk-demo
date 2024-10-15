import React from 'react';
import { ExternalLink } from './Icons';

export function DocumentationLink({ link }: { link: string }) {
  return (
    <div className="documentation-link">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div>Docs</div>
        <ExternalLink />
      </a>
    </div>
  );
}
