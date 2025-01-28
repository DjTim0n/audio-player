import { useAuthStore } from '@/store/auth/auth-store-provider';
import { api } from '../config/axios';
import { useCallback } from 'react';

export const useRefreshToken = (): (() => Promise<{ accessToken: string; refreshToken: string } | undefined>) => {
  const refresh_token = useAuthStore((state) => state.refresh_token);
  const setAuth = useAuthStore((state) => state.setAuth);

  const refresedToken = useCallback(async (): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
    if (!refresh_token || refresh_token?.trim().length === 0) return;

    const response = await api
      .post(`/auth/refresh_token`, {
        refresh_token: refresh_token,
      })
      .catch((error) => {
        console.error('Error refreshing token', error);
      });
    const data = response?.data as {
      accessToken: string;
      refreshToken: string;
    };

    setTimeout(() => {
      setAuth({
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        isAuth: true,
      });
    }, 500);
    return data;
  }, [refresh_token, setAuth]);

  return refresedToken;
};
