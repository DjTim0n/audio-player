export type AuthState = {
  isAuth: boolean;
  access_token: string;
  refresh_token: string;
};

export type AuthActions = {
  setAuth: (auth: AuthState) => void;
  clearAuth: () => void;
};

export type AuthStore = AuthState & AuthActions;
