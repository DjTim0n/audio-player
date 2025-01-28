import { AuthTabs } from '../ui/auth-tabs';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import { BackgroundGradient } from '../ui/background-gradient';

export const AuthPage = () => {
  return (
    <>
      <BackgroundBeamsWithCollision className="md:h-dvh">
        <div className="flex items-center justify-center h-full">
          <BackgroundGradient >
            <div className="flex max-h-full items-center overflow-hidden max-w-md w-full mx-auto rounded-none md:rounded-3xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
              <div className="container flex flex-col justify-center items-center p-0">
                <AuthTabs />
              </div>
            </div>
          </BackgroundGradient>
        </div>
      </BackgroundBeamsWithCollision>
    </>
  );
};
