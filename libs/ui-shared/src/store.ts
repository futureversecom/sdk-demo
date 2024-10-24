import {
  ExtrinsicPayload,
  ExtrinsicResult,
  RootTransactionBuilder,
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
  currentBuilder: RootTransactionBuilder | null;
  error: string | null;
  signedCallback: (() => void) | undefined;
  resultCallback: ((result: ExtrinsicResult) => void) | undefined;
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
  setCurrentBuilder: (currentBuilder: RootTransactionBuilder) => void;
  resetState: () => void;
  setError: (error: string) => void;
  setSignedCallback: ((signedCallback: () => void) => void) | undefined;
  setResultCallback:
    | ((resultCallback: (result: ExtrinsicResult) => void) => void)
    | undefined;
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
  error: null,
  signedCallback: undefined,
  resultCallback: undefined,
};

export const createRootStore = (initState: RootState = defaultInitState) => {
  return createStore<RootStore>()(set => ({
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
    setCurrentBuilder: (currentBuilder: RootTransactionBuilder) =>
      set({ currentBuilder }),
    resetState: () =>
      set({
        toSign: null,
        payload: null,
        signed: false,
        sent: false,
        result: null,
        gas: undefined,
        error: null,
      }),
    setError: (error: string) => set({ error }),
    setSignedCallback: (signedCallback: (() => void) | undefined) =>
      set({ signedCallback }),
    setResultCallback: (
      resultCallback: ((result: ExtrinsicResult) => void) | undefined
    ) => set({ resultCallback }),
  }));
};
