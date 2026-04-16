import { CircleUser, Gem } from 'lucide-react';
import Image from 'next/image';
import { BillingLargeBlock } from '@/components/shared/billing-block-large';
import { Button } from '@/components/ui/button';

export default function PricingSection() {
  return (
    <section
      className='flex flex-col overflow-hidden pb-20 max-sm:px-5'
      id='pricing'>
      <div className='flex flex-col items-center text-5xl font-semibold mb-5'>
        <h1 className='font-nunito-sans text-center'>
          Transparent{' '}
          <div className='font-black text-secondary relative inline-block'>
            pricing
            <Image
              src={'/assets/hyphen.svg'}
              width={100}
              height={30}
              alt='some'
              className='scale-150 translate-x-5 absolute -bottom-3.75'
            />
          </div>{' '}
          for every person
        </h1>
      </div>
      <p className='font-nunito-sans font-medium text-lg text-neutral-800 text-center'>
        Explore the tool for find the job of your dream faster with AI.
      </p>
      <div className='mx-auto grid grid-rows-[auto-auto]'>
        <div className='grid grid-cols-3 grid-rows-[auto_1fr] overflow-y-auto mt-10'>
          <div className='bg-white'></div>
          <div className='rounded-t uppercase text-white bg-primary text-center font-semibold font-nunito-sans py-3 translate-y-px xs:hidden xl:block'>
            most popular
          </div>
          <div className='bg-white'></div>
          <div className='col-span-3 grid grid-cols-3 divide-x border border-gray-200 rounded xs:grid-cols-1 xs:divide-x-0 xl:grid-cols-3 xl:divide-x'>
            <BillingLargeBlock
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
            <BillingLargeBlock
              className='bg-linear-to-b to-primary/10 z-10'
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
            <BillingLargeBlock
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
        <div className='flex items-center justify-between w-full p-0 mx-auto max-sm:flex-col max-sm:items-start'>
          <p className='text-sm text-neutral-500'>Cancel anytime. We'll remind you three days before your trial ends.</p>
          <Button
            variant={'link'}
            className='px-0 max-sm:ml-auto'>
            See all features
          </Button>
        </div>
      </div>
    </section>
  );
}
