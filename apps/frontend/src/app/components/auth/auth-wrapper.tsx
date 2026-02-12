import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Watermark } from '@/components/ui/watermark';

interface AuthWrapperProps {
  children: ReactNode[] | ReactNode;
  className?: string;
  heading: string;
  isSocialAuth?: boolean;
}

export function AuthWrapper({ children, heading, className, isSocialAuth = true }: AuthWrapperProps) {
  return (
    <div className={`mx-auto flex flex-col gap-4 w-fit ${className || ''}`}>
      <h1 className='text-4xl font-semibold font-montserrat tracking-tighter text-blue-900'>{heading}</h1>
      {isSocialAuth && (
        <>
          <Button
            className='bg-primary'
            size='lg'>
            Continue with Google
          </Button>
          <div className='flex items-center'>
            <hr className='border-gray-200 w-full'></hr>
            <p className='px-3'>or</p>
            <hr className='border-gray-200 w-full'></hr>
          </div>
        </>
      )}
      {children}
      <Watermark name='JobResearcher AI' />
    </div>
  );
}
