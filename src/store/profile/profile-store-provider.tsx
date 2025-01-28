'use client';

import { createContext, useContext, useRef } from 'react';
import { createProfileStore } from './profile-store';
import { ProfileStore } from './types';
import { useStore } from 'zustand';

export type ProfileStoreApi = ReturnType<typeof createProfileStore>;

export const ProfileStoreContext = createContext<ProfileStoreApi | undefined>(undefined);

export const ProfileStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<ProfileStoreApi>(undefined);

  if (!storeRef.current) {
    storeRef.current = createProfileStore();
  }

  return <ProfileStoreContext.Provider value={storeRef.current}>{children}</ProfileStoreContext.Provider>;
};

export const useProfileStore = <T,>(selector: (store: ProfileStore) => T) => {
  const profileStoreContext = useContext(ProfileStoreContext);

  if (!profileStoreContext) {
    throw new Error('useProfileStore must be used within an ProfileStoreProvider');
  }
  return useStore(profileStoreContext, selector);
};
