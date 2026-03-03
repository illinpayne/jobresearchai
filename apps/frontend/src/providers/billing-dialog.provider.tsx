'use client';

import { CircleUser, Gem, X } from 'lucide-react';
import Image from 'next/image';
import { BillingBlock } from '@/components/shared/billing-block';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBillingDialog } from '@/hooks/useBillingDialog.hook';

export const BillingModalProvider = () => {
  const { onOpen, onClose, isOpen } = useBillingDialog();

  return (
    <Dialog
      onOpenChange={onOpen}
      open={isOpen}>
      <DialogContent
        showCloseButton={false}
        className='rounded-xs sm:max-w-fit sm:max-h-fit pb-2'>
        <DialogHeader>
          <div className='flex items-center gap-2 select-none'>
            <Image
              src={'/images/icon.webp'}
              width={24}
              height={24}
              alt='logo'
            />
            <h1 className='font-medium text-xl'>JobResearch</h1>
            <button
              onClick={onClose}
              className='ml-auto cursor-pointer text-neutral-500 hover:text-blue-700'>
              <X className='size-5' />
            </button>
          </div>
          <DialogTitle className='text-2xl font-inter leading-5 mt-3'>
            Upgrade to elevate your stuff faster with{' '}
            <span className='bg-linear-to-r text-transparent bg-clip-text from-blue-500 to-emerald-500'>AI</span>
          </DialogTitle>
          <DialogDescription>
            By upgrading, you get more attempts to review your resumes, getting vacancies, offers, and more.
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-3 grid-rows-[auto_1fr] mt-4 overflow-y-auto'>
          <div className='bg-white'></div>
          <div className='rounded-t uppercase text-white bg-primary text-center font-semibold font-inter text-xs py-1 translate-y-px'>
            most popular
          </div>
          <div className='bg-white'></div>
          <div className='col-span-3 grid grid-cols-3 divide-x border border-gray-200 rounded'>
            <BillingBlock
              title={`You're on Free`}
              description='Get started with the basics'
              actionButton={
                <Button
                  disabled
                  className='rounded-xs'
                  variant={'outline'}
                  size={'sm'}>
                  Current plan
                </Button>
              }
              banner={<></>}
              benefitsTitle='Free is limited to:'
              benefits={[{ title: 'Up to 1 resume upload' }]}
            />
            <BillingBlock
              className='outline-1 outline-primary z-10'
              title={`Standart`}
              description='Speed up finding job with more detailed resume review'
              actionButton={
                <Button
                  className='rounded-xs'
                  size={'sm'}>
                  Try to use
                </Button>
              }
              banner={
                <div className='bg-primary/10 rounded-xs text-sm p-4'>
                  <p className='font-semibold flex gap-1 items-center'>
                    <CircleUser className='size-5' /> Fit
                  </p>
                  <p className='text-neutral-800 mt-2'>Perfect fit for the first time!</p>
                </div>
              }
              benefitsTitle='Everything from Free, plus:'
              benefits={[
                { title: 'Up to 3 resume upload per month', active: true },
                { title: 'Ability to buy extra credits', active: true },
                { title: 'Get into weekly TOP board with top candidates', active: true },
                { title: 'Thinker AI', active: true },
              ]}
            />
            <BillingBlock
              title={`Premium`}
              description='Get our of boundaries with ultimate power of unlimits'
              actionButton={
                <Button
                  className='rounded-xs'
                  size={'sm'}>
                  Try for free for 3 days trial
                </Button>
              }
              banner={
                <div className='bg-linear-to-r from-secondary/10 to-primary/10 rounded-xs text-sm p-4'>
                  <p className='font-semibold flex gap-1 items-center'>
                    <Gem className='size-5' /> Ultimate
                  </p>
                  <p className='text-neutral-800 mt-2'>Unlimited stuff to work on!</p>
                </div>
              }
              benefitsTitle='Everything from Standart, plus:'
              benefits={[
                { title: 'Up to 9 resume upload per month', active: true },
                { title: 'Ability to buy extra credits', active: true },
                { title: 'Ability to get fresh vacancies by uploaded resume', active: true },
                { title: 'Gets exclisive badge for premium users', active: true },
                { title: 'Filtering found vacancies using AI', active: true },
              ]}
            />
          </div>
        </div>
        <div className='flex items-center justify-between w-full p-0'>
          <p className='text-sm text-neutral-500'>Cancel anytime. We'll remind you three days before your trial ends.</p>
          <Button
            variant={'link'}
            className='px-0'>
            See all features
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
