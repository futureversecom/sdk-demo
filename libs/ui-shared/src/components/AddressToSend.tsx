import React from 'react';
import { isAddress } from 'viem';

type AddressToSendProps = {
  addressToSend: string;
  setAddressToSend: (address: string) => void;
  addressInputError: string;
  setAddressInputError: (error: string) => void;
  disable: boolean;
  resetState: () => void;
  label?: string;
};

export const AddressToSend: React.FC<AddressToSendProps> = ({
  addressToSend,
  setAddressToSend,
  addressInputError,
  setAddressInputError,
  disable,
  resetState,
  label = 'Send To',
}) => {
  return (
    <label>
      {label}
      <input
        type="text"
        value={addressToSend}
        className="w-full builder-input"
        maxLength={42}
        onChange={e => {
          console.log(isAddress(e.target.value));
          setAddressInputError('');
          if (
            !isAddress(e.target.value) ||
            e.target.value === '0x0000000000000000000000000000000000000000'
          ) {
            setAddressInputError('Address is invalid or null');
          }
          resetState();
          setAddressToSend(e.target.value);
        }}
        disabled={disable}
      />
      <span
        style={{ display: 'inline-block', fontSize: '0.8rem' }}
        className="text-red-500"
      >
        {addressInputError}
      </span>
    </label>
  );
};