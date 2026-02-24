'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Watermark } from '@/components/ui/watermark';
import { APP_CONFIG, OAUTH_CONFIG } from '@/constants';
import { cn } from '@/lib/utils';

interface AuthWrapperProps {
  children: ReactNode[] | ReactNode;
  className?: string;
  heading: string;
  isSocialAuth?: boolean;
}

export function AuthWrapper({ children, heading, className, isSocialAuth = true }: AuthWrapperProps) {
  function getOAuthURL() {
    const rootUrl = OAUTH_CONFIG.rootUrl;
    const options = {
      redirect_uri: `${APP_CONFIG.apiUrl}${OAUTH_CONFIG.redirectPath}`,
      client_id: OAUTH_CONFIG.clientId as string,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
    };

    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  }

  return (
    <div className={`mx-auto flex flex-col gap-4 ${className || ''}`}>
      <h1 className='text-4xl font-semibold font-montserrat tracking-tighter text-blue-900'>{heading}</h1>
      {isSocialAuth && (
        <div className='grid grid-cols-1 gap-4'>
          <Link
            href={getOAuthURL()}
            className={cn(buttonVariants({ size: 'lg' }), 'bg-primary')}>
            Continue with Google
          </Link>
          <div className='flex items-center col-span-2'>
            <hr className='border-gray-200 w-full'></hr>
            <p className='px-3'>or</p>
            <hr className='border-gray-200 w-full'></hr>
          </div>
        </div>
      )}
      {children}
      <Watermark name='JobResearcher AI' />
    </div>
  );
}
