export type ProfileState = {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
};

export type ProfileActions = {
  setProfile: (profile: ProfileState) => void;
  clearProfile: () => void;
};

export type ProfileStore = ProfileState & ProfileActions;
