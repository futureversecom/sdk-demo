'use client';

import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { TickIcon, CopyIcon } from './Icons';

export function CopyText({
  text,
  children,
}: {
  text: string;
  children?: React.ReactNode;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="copy-text">
      <div className="content">{children}</div>
      <div className="icon" onClick={() => copyToClipboard(text)}>
        {isCopied ? <TickIcon /> : <CopyIcon />}
      </div>
    </div>
  );
}
