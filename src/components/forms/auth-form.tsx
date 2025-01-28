'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '@/lib/config/axios';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useRouter } from 'next/navigation';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { push } = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const handleAuth = () => {
    api
      .post('/auth/login', {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        setAuth({
          isAuth: true,
          access_token: res.data.accessToken,
          refresh_token: res.data.refreshToken,
        });

        push('/main');
      });
  };
  return (
    <>
      <div className="flex flex-col gap-5 mx-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="border-2 border-gray-600 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="border-2 border-gray-600 rounded-xl"
          />
        </div>

        <Button
          onClick={handleAuth}
          className="w-1/2 justify-self-center self-center mt-4 active:scale-90 transition-all"
        >
          Sign In
        </Button>
      </div>
    </>
  );
};
