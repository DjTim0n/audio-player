'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';

interface ResendOTPButtonProps {
  resendOTP: () => void;
}

export const ResendOTPButton = ({ resendOTP }: ResendOTPButtonProps) => {
  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  const handleResendOTP = () => {
    setIsButtonDisabled(true);
    setTimer(60); // 60 секунд
    resendOTP();
  };

  return (
    <Button
      onClick={handleResendOTP}
      className="w-1/2 justify-self-center self-center active:scale-90 transition-all"
      disabled={isButtonDisabled}
    >
      {isButtonDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
    </Button>
  );
};
