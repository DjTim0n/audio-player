'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProfileStore } from '@/store/profile/profile-store-provider';
import { useRouter } from 'next/navigation';

export const HeaderProfile = () => {
  const profile = useProfileStore((state) => state);
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div>
            <Avatar>
              <AvatarImage className="object-cover" src={profile.avatar} alt="@user" title="@user" />
              <AvatarFallback className="text-foreground">{profile.first_name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <span>
                {profile.first_name} {profile.last_name}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push('/profile');
              }}
            >
              <span className="text-foreground">Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
