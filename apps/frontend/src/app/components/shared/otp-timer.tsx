'use client';

import { Button } from '@/components/ui/button';
import { useOtpTicker, useOtpTrigger } from '@/hooks';
import { Loader2, RotateCcw } from 'lucide-react';

interface OtpTimerProps {
  onResend: () => Promise<void> | void;
  storageKey: string;
  duration: number;
  isLoading?: boolean;
}

export function OtpTimer({ onResend, storageKey, duration, isLoading }: OtpTimerProps) {
  const { formattedTime, canResend } = useOtpTicker(storageKey);
  const { startTimer } = useOtpTrigger(storageKey, duration);

  const handleResendClick = async () => {
    try {
      await onResend();
      startTimer();
    } catch (error) {
      console.error('Failed to resend OTP', error);
    }
  };

  return (
    <>
      {!canResend ? (
        <div className='flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in zoom-in duration-300'>
          <Loader2 className='h-3 w-3 animate-spin text-blue-500' />
          <span>Resend code in</span>
          <span className='font-mono font-bold text-blue-600'>{formattedTime}</span>
        </div>
      ) : (
        <Button
          type='button'
          variant='link'
          size='sm'
          onClick={handleResendClick}
          disabled={isLoading}
          className='transition-all duration-300 ease-in-out'>
          {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <RotateCcw className='mr-2 h-4 w-4' />}
          Resend Code
        </Button>
      )}
    </>
  );
}
