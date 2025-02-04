'use client';

import Loading from '@/app/loading';
import { useAxiosAuth } from '@/lib/hooks/useAxiosAuth';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useProfileStore } from '@/store/profile/profile-store-provider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const useAuth = ({ redirect = true }: { redirect?: boolean } = {}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentPath = usePathname();
  const { push } = useRouter();
  const access_token = useAuthStore((state) => state.access_token);
  console.log('🚀 ~ useAuth ~ access_token:', access_token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const api = useAxiosAuth();

  const getMe = async () => {
    return await api
      .get('/profile/get_profile')
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          setProfile(data);
          setUser(data);

          return {
            data: {
              ...res.data.data,
            },
            error: null,
          };
        } else {
          return {
            data: null,
            error: 'Unauthorized',
          };
        }
      })
      .catch((error) => {
        clearProfile();
        clearAuth();
        return {
          data: error,
          error: 'Unauthorized',
        };
      });
  };

  const getUser = async () => {
    const { data, error } = await getMe();
    if (error || !data) {
      console.log('🚀 ~ getUser ~ currentPath:', currentPath);
      if (![`/login`].includes(currentPath)) {
        push('/login');
      }
      setError(error);
      setUser(null);
      setLoading(false);
      return;
    }
    if (currentPath === '/login') {
      push('/');
    }
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    if (access_token === '' || !access_token) {
      console.log('IN IF ACCESS_TOKEN', access_token);
      setTimeout(() => {
        getUser();
      }, 700);
      return;
    }

    getUser();
  }, [api, access_token, currentPath, push, setProfile, redirect, clearAuth]);

  return { user, loading, error };
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth({ redirect: false });

  if (auth.loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthProvider;
