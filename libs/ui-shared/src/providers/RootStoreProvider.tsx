'use client';

import React from 'react';
import { createRootStore } from '../store';
import { type ReactNode, createContext, useRef } from 'react';

export type RootStoreApi = ReturnType<typeof createRootStore>;

export const RootStoreContext = createContext<RootStoreApi | undefined>(
  undefined
);

export interface RootStoreProviderProps {
  children: ReactNode;
}

export const RootStoreProvider = ({ children }: RootStoreProviderProps) => {
  const storeRef = useRef<RootStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createRootStore();
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
};
