import { useAuth } from '@futureverse/auth-react';
import React from 'react';

type SendFromProps = {
  shouldShowEoa?: boolean;
  fromWallet: 'eoa' | 'fpass';
  setFromWallet: (wallet: 'eoa' | 'fpass') => void;
  resetState: () => void;
  disable: boolean;
  setAddressToSend?: (address: string) => void;
  label?: string;
};

export default function SendFrom({
  shouldShowEoa = true,
  fromWallet,
  setFromWallet,
  resetState,
  disable,
  setAddressToSend,
  label = 'Send From',
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
          resetState();
          setFromWallet(e.target.value as 'eoa' | 'fpass');
          setAddressToSend &&
            setAddressToSend(
              userSession
                ? e.target.value === 'eoa' && shouldShowEoa
                  ? userSession?.futurepass
                  : userSession?.eoa
                : ''
            );
        }}
      >
        {shouldShowEoa && <option value="eoa">EOA</option>}
        <option value="fpass">FuturePass</option>
      </select>
    </label>
  );
}