'use client';

import { useProfileStore } from '@/store/profile/profile-store-provider';
import Image from 'next/image';

export const ProfileFrom = () => {
  const profile = useProfileStore((store) => store);

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <Image alt="profile" src={profile.avatar ? profile.avatar : '/placeholder.svg'} width={100} height={100} />
      <p>{profile.email}</p>
      <p>{profile.first_name}</p>
      <p>{profile.last_name}</p>
    </div>
  );
};
