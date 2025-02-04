'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '@/lib/config/axios';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useRouter } from 'next/navigation';
import { IsLoadingIcon } from '../ui/loading';
import { InputOTPComponent } from '../ui/input-otp';
import { ResendOTPButton } from '../ui/resend-otp-button';

interface AuthFormProps {
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthForm = ({ setDisabled }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { push } = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const handleAuth = () => {
    setError('');
    setIsLoading(true);
    setDisabled(true);
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
        push('/');
      })
      .catch((error) => {
        if (error.response.data.message === 'User not verified') {
          setIsOTPSent(true);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        setDisabled(false);
        setError('Invalid credentials');
      });
  };

  const handleOTP = async () => {
    setIsLoading(true);
    setError('');
    api
      .post('/auth/verify', {
        email,
        code: +code,
      })
      .then((res) => {
        console.log(res.data);
        setAuth({
          isAuth: true,
          access_token: res.data.accessToken,
          refresh_token: res.data.refreshToken,
        });

        push('/main');
      })
      .catch(() => {
        setIsLoading(false);
        setError('Invalid Code');
      });
  };

  const resendOTP = () => {
    if (isLoading) return;
    setError('');
    api
      .post('/auth/resend_code', {
        email,
      })
      .then(() => {
        console.log('OTP sent');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {isOTPSent ? (
        <>
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="w-1/2 flex flex-col items-center justify-center">
              <InputOTPComponent code={code} setCode={setCode} />
            </div>
            {isLoading ? (
              <IsLoadingIcon />
            ) : (
              <>
                <Button
                  onClick={handleOTP}
                  className="w-1/2 justify-self-center self-center active:scale-90 transition-all"
                  disabled={code.length < 6}
                >
                  Send OTP
                </Button>
              </>
            )}
            <ResendOTPButton resendOTP={resendOTP} />
            {error === 'Invalid Code' && (
              <>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-red-500">Invalid code!</p>
                  <p className="text-red-500">Resend it.</p>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-5 mx-4">
          {error === 'Invalid credentials' && (
            <>
              <div className="flex flex-col items-center justify-center">
                <p className="text-red-500">Invalid credentials!</p>
              </div>
            </>
          )}

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

          {isLoading ? (
            <div className="flex w-full justify-center self-center">
              <IsLoadingIcon />
            </div>
          ) : (
            <Button
              onClick={handleAuth}
              className="w-1/2 justify-self-center self-center mt-4 active:scale-90 transition-all"
            >
              Sign In
            </Button>
          )}
        </div>
      )}
    </>
  );
};
