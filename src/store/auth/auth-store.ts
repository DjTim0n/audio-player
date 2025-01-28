import { createStore } from 'zustand';
import { AuthState, AuthStore } from './types';
import { createJSONStorage, persist } from 'zustand/middleware';

export const defaultAuthState: AuthState = {
  isAuth: false,
  access_token: '',
  refresh_token: '',
};

export const createAuthStore = (initState: AuthState = defaultAuthState) => {
  return createStore<AuthStore>()(
    persist(
      (set) => ({
        ...initState,
        isInitialized: false,
        setAuth: (auth: AuthState) => set(auth),
        clearAuth: () => set(defaultAuthState),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => sessionStorage),
        onRehydrateStorage() {
          console.log('hydration starts');

          // optional
          return (state, error) => {
            if (error) {
              console.log('an error happened during hydration', error);
            } else {
              console.log('hydration finished');
            }
          };
        },
      }
    )
  );
};
