'use client';
import { useAuth } from '@futureverse/auth-react';

import React from 'react';

type SendFromProps = {
  shouldShowEoa?: boolean;
  fromWallet: 'eoa' | 'pass';
  setFromWallet: (wallet: 'eoa' | 'pass') => void;
  resetState?: () => void;
  disable?: boolean;
  setAddressToSend?: (address: string) => void;
  label?: string;
  onChangeEvent?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SendFrom({
  shouldShowEoa = true,
  fromWallet,
  setFromWallet,
  resetState,
  disable,
  setAddressToSend,
  label = 'Send From',
  onChangeEvent,
}: SendFromProps) {
  const { userSession } = useAuth();

  return (
    <label>
      {label}
      <select
        value={fromWallet}
        className="w-full builder-input"
        disabled={disable}
        onChange={e => {
          resetState && resetState();
          setFromWallet(e.target.value as 'eoa' | 'pass');
          setAddressToSend &&
            setAddressToSend(
              userSession
                ? e.target.value === 'eoa' && shouldShowEoa
                  ? userSession?.futurepass
                  : userSession?.eoa
                : ''
            );
          onChangeEvent && onChangeEvent(e);
        }}
      >
        {shouldShowEoa && <option value="eoa">EOA</option>}
        <option value="pass">Pass</option>
      </select>
    </label>
  );
}
