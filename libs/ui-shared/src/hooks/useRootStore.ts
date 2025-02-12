'use client';
import { useContext } from 'react';
import { useStore } from 'zustand';
import { RootStoreContext } from '../providers/RootStoreProvider';
import { RootStore } from '../store';

export const useRootStore = <T>(selector: (store: RootStore) => T): T => {
  const rootStoreContext = useContext(RootStoreContext);

  if (!rootStoreContext) {
    throw new Error(`useRootStore must be used within RootStoreProvider`);
  }

  return useStore(rootStoreContext, selector);
};
