'use client';

import React from 'react';
import { isAddress } from 'viem';

type AddressToSendProps = {
  inputAddress: string;
  setInputAddress: (address: string) => void;
  addressInputError: string;
  setAddressInputError: (error: string) => void;
  disable?: boolean;
  resetState?: () => void;
  label?: string;
  canBeNull?: boolean;
};

export const AddressInput: React.FC<AddressToSendProps> = ({
  inputAddress,
  setInputAddress,
  addressInputError,
  setAddressInputError,
  disable,
  resetState,
  label = 'Send To',
  canBeNull = false,
}) => {
  return (
    <label>
      {label}
      <input
        type="text"
        value={inputAddress}
        className="w-full builder-input"
        maxLength={42}
        style={{ marginTop: '4px' }}
        onChange={e => {
          setAddressInputError('');
          if (e.target.value === '' && canBeNull) {
            setAddressInputError('');
            setInputAddress('');
            return;
          }
          if (
            !isAddress(e.target.value) ||
            e.target.value === '0x0000000000000000000000000000000000000000'
          ) {
            setAddressInputError('Address is invalid or null');
          }
          resetState && resetState();
          setInputAddress(e.target.value);
        }}
        disabled={disable}
      />
      {addressInputError !== '' && (
        <span
          style={{ display: 'inline-block', fontSize: '0.8rem' }}
          className="text-red-500"
        >
          {addressInputError}
        </span>
      )}
    </label>
  );
};
