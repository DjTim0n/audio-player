'use client';

import { createContext, useContext, useRef } from 'react';
import { createAuthStore } from './auth-store';
import { AuthStore } from './types';
import { useStore } from 'zustand';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(undefined);

export const AuthStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AuthStoreApi>(undefined);

  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return <AuthStoreContext.Provider value={storeRef.current}>{children}</AuthStoreContext.Provider>;
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T) => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext) {
    throw new Error('useAuthStore must be used within an AuthStoreProvider');
  }
  return useStore(authStoreContext, selector);
};
