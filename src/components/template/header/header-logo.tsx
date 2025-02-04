'use client';

import { useRouter } from 'next/navigation';

export const HeaderLogo = () => {
  const router = useRouter();
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        router.push('/');
      }}
    >
      TimSpaceAudio
    </div>
  );
};
