'use client';

import React from 'react';
import { useCopyToClipboard } from '../hooks';
import { TickIcon, CopyIcon } from './Icons';

export function CopyButton({
  contentToCopy,
}: {
  contentToCopy: string | boolean | number | object;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <button
      className="code-btn green"
      onClick={() => {
        const themeString =
          typeof contentToCopy === 'string'
            ? contentToCopy
            : JSON.stringify(contentToCopy, null, 2);
        copyToClipboard(themeString);
      }}
    >
      {isCopied ? <TickIcon /> : <CopyIcon />}
    </button>
  );
}
