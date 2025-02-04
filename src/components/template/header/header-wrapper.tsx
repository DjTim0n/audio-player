'use client';

import { useAuthStore } from '@/store/auth/auth-store-provider';

export const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAuthStore((state) => state.isAuth);

  if (!isAuth) {
    return <></>;
  }

  return <header className="w-full h-16  text-white flex items-center justify-between px-5">{children}</header>;
};
