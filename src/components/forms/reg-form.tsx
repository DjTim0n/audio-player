'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '@/lib/config/axios';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useRouter } from 'next/navigation';

export const RegForm = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { push } = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const handleAuth = () => {
    api
      .post('/auth/register', {
        email,
        password,
        first_name,
        last_name,
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
        <div className="flex flex-row justify-between ">
          <div className="flex flex-col gap-2">
            <label htmlFor="first_name">First Name</label>
            <Input
              id="first_name"
              type="text"
              value={first_name}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="border-2 border-gray-600 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="">Last Name</label>
            <Input
              type="test"
              value={last_name}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="border-2 border-gray-600 rounded-xl"
            />
          </div>
        </div>
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

        <Button onClick={handleAuth} className="w-1/2 justify-self-center self-center active:scale-90 transition-all">
          Sign Up
        </Button>
      </div>
    </>
  );
};
