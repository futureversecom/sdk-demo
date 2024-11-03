'use client';

import React, { useCallback } from 'react';
import { useChainId, useConfig } from 'wagmi';
import { switchChain } from '@wagmi/core';
import { useAuth } from '@futureverse/auth-react';

export function CurrentChainSwap() {
  const { userSession } = useAuth();

  const chainId = useChainId();
  const config = useConfig();

  const switchToChain = useCallback(async () => {
    if (!userSession?.chainId) return;
    await switchChain(config, { chainId: userSession?.chainId });
  }, [config, userSession?.chainId]);

  return (
    <>
      {chainId}{' '}
      {chainId !== userSession?.chainId && (
        <div className="text-link" onClick={async () => await switchToChain()}>
          Switch To Porcini
        </div>
      )}
    </>
  );
}
