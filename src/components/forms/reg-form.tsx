'use client';

import { FormEvent, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '@/lib/config/axios';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useRouter } from 'next/navigation';
import { InputOTPComponent } from '../ui/input-otp';
import { IsLoadingIcon } from '../ui/loading';
import { ResendOTPButton } from '../ui/resend-otp-button';
interface RegFormProps {
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}
export const RegForm = ({ setDisabled }: RegFormProps) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleAuth = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setIsLoading(true);
    setDisabled(true);
    api
      .post('/auth/register', {
        email,
        password,
        first_name,
        last_name,
      })
      .then(async () => {
        setIsOTPSent(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        if (error.response.data.message === 'User already exists') {
          setError('User already exists');
          setIsLoading(false);
          setDisabled(false);
        }
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
        <>
          <div>
            {error === 'User already exists' && (
              <>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-red-500">A user with this Email is already registered!</p>
                  <p className="text-red-500">Try to login.</p>
                </div>
              </>
            )}
          </div>
          <form
            onSubmit={(e) => {
              handleAuth(e);
            }}
            className="flex flex-col gap-5 mx-4"
          >
            {isLoading ? (
              <div className="flex w-full justify-center self-center">
                <IsLoadingIcon />
              </div>
            ) : (
              <>
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
                      required
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
                <Button type="submit" className="w-1/2 justify-self-center self-center active:scale-90 transition-all">
                  Sign Up
                </Button>
              </>
            )}
          </form>
        </>
      )}
    </>
  );
};
