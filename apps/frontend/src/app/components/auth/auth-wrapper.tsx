'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Watermark } from '@/components/ui/watermark';
import { cn } from '@/lib/utils';

interface AuthWrapperProps {
  children: ReactNode[] | ReactNode;
  className?: string;
  heading: string;
  isSocialAuth?: boolean;
}

export function AuthWrapper({ children, heading, className, isSocialAuth = true }: AuthWrapperProps) {
  function getOAuthURL() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: 'http://localhost:5000/v1/auth/oauth',
      client_id: process.env.NEXT_PUBLIC_OAUTH_ID as string,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
    };

    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  }

  return (
    <div className={`mx-auto flex flex-col gap-4 w-fit ${className || ''}`}>
      <h1 className='text-4xl font-semibold font-montserrat tracking-tighter text-blue-900'>{heading}</h1>
      {isSocialAuth && (
        <>
          <Link
            href={getOAuthURL()}
            className={cn(buttonVariants({ size: 'lg' }), 'bg-primary')}>
            Continue with Google
          </Link>
          {/* <Button
            className='bg-primary'
            size='lg'>
            Continue with Google
          </Button> */}
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
