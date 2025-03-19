'use client';

import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { TickIcon, CopyIcon } from './Icons';

export function CopyText({
  text,
  children,
  fullWidthFlex = false,
}: {
  text: string;
  children?: React.ReactNode;
  fullWidthFlex?: boolean;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="copy-text" style={fullWidthFlex ? { width: '100%' } : {}}>
      <div className="content" style={fullWidthFlex ? { flex: 'auto' } : {}}>
        {children}
      </div>
      <div
        className="icon"
        onClick={e => {
          e.stopPropagation();
          copyToClipboard(text);
        }}
        role="button"
        tabIndex={0}
        aria-label="Copy to clipboard"
      >
        {isCopied ? <TickIcon /> : <CopyIcon />}
      </div>
    </div>
  );
}
