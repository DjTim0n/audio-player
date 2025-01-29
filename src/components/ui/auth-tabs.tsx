'use client';

import { useState } from 'react';
import { AuthForm } from '../forms/auth-form';
import { RegForm } from '../forms/reg-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useRouter } from 'next/navigation';

export const AuthTabs = () => {
  const [disabled, setDisabled] = useState(false);
  const isAuth = useAuthStore((state) => state.isAuth);
  const { push } = useRouter();

  if (isAuth) {
    push('/main');
  }

  return (
    <>
      <Tabs defaultValue="auth" className="w-[400px] min-h-[400px] h-full grid">
        <TabsList className="grid w-3/4 grid-cols-2 justify-self-center">
          <TabsTrigger disabled={disabled} value="auth">
            Sing In
          </TabsTrigger>
          <TabsTrigger disabled={disabled} value="reg">
            Sing Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="auth" className="min-h-[250px] h-full">
          <AuthForm setDisabled={setDisabled} />
        </TabsContent>
        <TabsContent value="reg" className="min-h-[250px] h-full">
          <RegForm setDisabled={setDisabled} />
        </TabsContent>
      </Tabs>
    </>
  );
};
