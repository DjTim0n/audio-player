import { createStore } from 'zustand';
import { ProfileState, ProfileStore } from './types';
import { createJSONStorage, persist } from 'zustand/middleware';

export const defaultProfileState = {
  first_name: '',
  last_name: '',
  email: '',
  avatar: '',
};

export const createProfileStore = (initState: ProfileState = defaultProfileState) => {
  return createStore<ProfileStore>()(
    persist(
      (set) => ({
        ...initState,
        setProfile: (profile: ProfileState) => set(profile),
        clearProfile: () => set(defaultProfileState),
      }),
      {
        name: 'profile-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
};
