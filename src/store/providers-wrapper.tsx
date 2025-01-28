'use client';

import { ReactNode } from 'react';
import { AuthStoreProvider } from './auth/auth-store-provider';
import { ProfileStoreProvider } from './profile/profile-store-provider';

interface ProvidersWrapperProps {
  children: ReactNode;
}

const ProvidersWrapper = ({ children }: ProvidersWrapperProps) => {
  return (
    <AuthStoreProvider>
      <ProfileStoreProvider>{children}</ProfileStoreProvider>
    </AuthStoreProvider>
  );
};

export default ProvidersWrapper;
