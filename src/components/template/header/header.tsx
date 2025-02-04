import { HeaderLogo } from './header-logo';
import { HeaderProfile } from './header-profile';
import { HeaderWrapper } from './header-wrapper';

export const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderLogo />
      <HeaderProfile />
    </HeaderWrapper>
  );
};
