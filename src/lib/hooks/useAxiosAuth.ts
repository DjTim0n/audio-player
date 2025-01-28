'use client';

import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useRefreshToken } from './useRefreshToken';
import { useEffect } from 'react';
import { api, apiWithAuth } from '../config/axios';
import { AxiosResponse } from 'axios';

export const useAxiosAuth = () => {
  const refresedToken = useRefreshToken();

  const access_token = useAuthStore((state) => state.access_token);

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (req) => {
        if (!req.headers['Authorization']) {
          req.headers['Authorization'] = `Bearer ${access_token}`;
        }
        return req;
      },
      (error) => Promise.reject(error)
    );

    const onReject = (prevRequest: AxiosResponse, newAccessToken: string) => {
      prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return apiWithAuth(prevRequest);
    };

    const responseIntercept = api.interceptors.response.use(
      (response) => response,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (error: { config: any; response: { status: number } }) => {
        const prevRequest = error?.config;
        if (error.response.status === 401) {
          const newRefreshData = await refresedToken();
          if (newRefreshData) {
            const { accessToken: newAccessToken } = newRefreshData || [];
            return onReject(prevRequest, newAccessToken);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [access_token, refresedToken]);

  return api;
};
