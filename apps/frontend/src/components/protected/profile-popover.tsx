'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMe } from '@/api/hooks/useMe.hook';
import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants';
import { useBillingDialog } from '@/hooks/use-billing-dialog.hook';
import { cn } from '@/lib/utils';
import LogoutButton from './logout.button';

export default function ProfilePopover() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { onOpen } = useBillingDialog();

  const { data } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  function getColor(count: number) {
    if (count < 100) {
      return 'text-red-500';
    } else if (count >= 100 && count < 500) {
      return 'text-orange-500';
    } else if (count >= 500 && count < 1000) {
      return 'text-secondary';
    } else {
      return 'text-emerald-600';
    }
  }
  function getText(count: number) {
    if (count < 100) {
      return `You have less than ${count} credits remaining. Buy more to keep your automation running smoothly.`;
    } else if (count >= 100 && count < 500) {
      return `Don't let a low balance pause your work. Add tokens today and ensure every resume gets processed instantly.`;
    } else if (count >= 500 && count < 1000) {
      return 'Want to scale up your processing? Grab a bulk pack today and save 15% on your next top-up.';
    } else {
      return 'With this much power, you can process your entire resume backlog in seconds. You’re ready for anything!';
    }
  }

  if (!mounted || !data) {
    return <Skeleton className='size-10 rounded-full bg-neutral-300' />;
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {data?.avatar ? (
          <Image
            src={data.avatar}
            alt='image'
            className='size-10 object-contain rounded-full cursor-pointer data-[state=open]:outline-4 data-[state=open]:scale-95 transition-all'
            width={40}
            height={40}
          />
        ) : (
          <button className='size-10 rounded-full bg-primary border text-center leading-0 flex items-center justify-center font-semibold text-xl text-white uppercase select-none cursor-pointer data-[state=open]:outline-4 data-[state=open]:scale-95 transition-all'>
            {data?.firstName[0]}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        side='right'
        className='translate-x-8 -translate-y-5 px-0 flex flex-col gap-6 min-w-min'>
        <PopoverHeader className='px-4'>
          <PopoverTitle>Account</PopoverTitle>
          <div className='grid grid-cols-[36px_auto_auto] gap-2 mt-2 items-center'>
            {data?.avatar ? (
              <Image
                src={data.avatar}
                alt='image'
                className='size-9 object-contain rounded-full data-[state=open]:outline-4 data-[state=open]:scale-95 transition-all'
                width={36}
                height={36}
              />
            ) : (
              <div className='size-9 rounded-full bg-primary border text-center leading-0 flex items-center justify-center font-semibold text-lg text-white uppercase select-none'>
                {data?.firstName[0]}
              </div>
            )}
            <div className='flex flex-col *:leading-4'>
              <p className='whitespace-nowrap line-clamp-1'>
                {data?.firstName} {data?.secondName}
              </p>
              <p
                className='text-neutral-400
          '>
                {data?.email}
              </p>
            </div>
            <Link
              onClick={() => {
                setOpen(false);
              }}
              href={ROUTES.OVERVIEW.SETTINGS}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'ml-10')}>
              Settings
            </Link>
          </div>
        </PopoverHeader>
        <PopoverHeader className='px-4'>
          <PopoverTitle className='flex items-center justify-between'>
            <span>Billing</span>{' '}
            <Button
              onClick={onOpen}
              variant={'link'}
              className={cn('font-semibold text-md px-0', getColor(1000))}>
              100 Credits
            </Button>
          </PopoverTitle>
          <PopoverDescription>{getText(1000)}</PopoverDescription>
        </PopoverHeader>
        <div className='px-4 flex flex-col'>
          <LogoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
}
