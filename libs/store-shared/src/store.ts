import {
  CustomExtrinsicBuilder,
  ExtrinsicPayload,
  ExtrinsicResult,
} from '@futureverse/transact';

import { createStore } from 'zustand/vanilla';

export type RootState = {
  toSign: string | null;
  payload: ExtrinsicPayload | null;
  signed: boolean;
  sent: boolean;
  result: ExtrinsicResult | null;
  gas:
    | {
        gasString: string;
        gasFee: string;
        tokenDecimals: number;
      }
    | undefined;
  currentBuilder: CustomExtrinsicBuilder | null;
};

export type RootActions = {
  setToSign: (toSign: string) => void;
  setPayload: (payload: ExtrinsicPayload) => void;
  setSigned: (signed: boolean) => void;
  setSent: (sent: boolean) => void;
  setResult: (result: ExtrinsicResult) => void;
  setGas: (gas: {
    gasString: string;
    gasFee: string;
    tokenDecimals: number;
  }) => void;
  setCurrentBuilder: (currentBuilder: CustomExtrinsicBuilder) => void;
  resetState: () => void;
};

export type RootStore = RootState & RootActions;

export const defaultInitState: RootState = {
  toSign: null,
  payload: null,
  signed: false,
  sent: false,
  result: null,
  gas: undefined,
  currentBuilder: null,
};

export const createRootStore = (initState: RootState = defaultInitState) => {
  return createStore<RootStore>()((set) => ({
    ...initState,
    setToSign: (toSign: string) => set({ toSign }),
    setPayload: (payload: ExtrinsicPayload) => set({ payload }),
    setSigned: (signed: boolean) => set({ signed }),
    setSent: (sent: boolean) => set({ sent }),
    setResult: (result: ExtrinsicResult) => set({ result }),
    setGas: (gas: {
      gasString: string;
      gasFee: string;
      tokenDecimals: number;
    }) => set({ gas }),
    setCurrentBuilder: (currentBuilder: CustomExtrinsicBuilder) =>
      set({ currentBuilder }),
    resetState: () =>
      set({
        toSign: null,
        payload: null,
        signed: false,
        sent: false,
        result: null,
        gas: undefined,
      }),
  }));
};
