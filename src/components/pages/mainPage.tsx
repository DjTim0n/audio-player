'use client';

import { useProfileStore } from '@/store/profile/profile-store-provider';
import { AudioPlayer } from '../audio-player';
import { BackgroundGradient } from '../ui/background-gradient';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/auth/auth-store-provider';
import { useRouter } from 'next/navigation';
import { UploadFileForm } from '../forms/uploadFile-form';

export const MainPage = () => {
  const profile = useProfileStore((state) => state);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { push } = useRouter();

  const handleLogOut = () => {
    push('/login');
    clearAuth();
    profile.clearProfile();
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col items-center justify-center gap-2">
        <BackgroundGradient className="p-2">
          <div className="flex flex-col items-center justify-center gap-3 py-3 px-16 bg-black rounded-xl">
            <h1>Hello {profile.first_name} !</h1>
            <h2>This page not completed yet</h2>
            <Button
              onClick={() => {
                handleLogOut();
              }}
              className="bg-red-400 text-white"
            >
              Log Out
            </Button>
          </div>
        </BackgroundGradient>
        <BackgroundGradient>
          <div className="p-2">
            <AudioPlayer />
          </div>
        </BackgroundGradient>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <BackgroundGradient>
          <div className="p-2">
            <UploadFileForm />
          </div>
        </BackgroundGradient>
      </div>
    </div>
  );
};
