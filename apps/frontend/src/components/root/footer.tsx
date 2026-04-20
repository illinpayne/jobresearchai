'use client';

import App from 'next/app';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApplicationName } from '@/constants';
import { navigations } from './header';

const accountNavigation = [
  {
    title: 'Dashboard',
    href: '/overview',
  },
  {
    title: 'Uploaded resumes',
    href: '/overview/resumes',
  },
  {
    title: 'New vacancies',
    href: '/overview/vacancies',
  },
  {
    title: 'Settings',
    href: '/overview/setting',
  },
];

export default function Footer() {
  const router = useRouter();
  return (
    <footer className='grid gap-5 w-280 mx-auto py-10 xs:w-auto lg:w-[90%] xl:w-[80%] 2xl:w-280'>
      <div className='bg-neutral-200/20 rounded-b-xl px-10 py-5 grid grid-cols-3 xs:grid-cols-1 lg:grid-cols-3'>
        <div>
          <div className='flex gap-2 items-center select-none'>
            <Image
              src={'/images/icon.webp'}
              width={24}
              height={24}
              alt='logo'
            />
            <span className='font-black text-2xl text-primary font-angry tracking-wide translate-y-0.5'>{ApplicationName}</span>
          </div>
        </div>
        <div className='grid grid-cols-2 col-span-2 font-nunito-sans xs:grid-cols-1 xs:mt-10 xs:gap-10 sm:grid-cols-2 sm:gap-2 lg:mt-0'>
          <nav className='list-none flex flex-col items-start gap-1'>
            <h1 className='font-bold uppercase text-neutral-700 mb-5'>Navigation</h1>
            {navigations.map((f, i) => (
              <li
                key={`${f.title}_${i}`}
                onClick={() => {
                  router.push(f.href, { scroll: true });
                }}
                className='hover:text-blue-500 cursor-pointer font-semibold'>
                {f.title}
              </li>
            ))}
          </nav>
          <nav className='list-none flex flex-col items-start gap-1'>
            <h1 className='font-bold uppercase text-neutral-700 mb-5'>Accounting</h1>
            {accountNavigation.map((f, i) => (
              <li
                key={`${f.title}_${i}`}
                onClick={() => {
                  router.push(f.href);
                }}
                className='hover:text-blue-500 cursor-pointer font-semibold'>
                {f.title}
              </li>
            ))}
          </nav>
        </div>
      </div>
      <div className='flex text-sm justify-between items-center gap-10 text-neutral-600 xs:px-10 lg:px-0'>
        <p className='font-nunito-sans font-medium'>Copyright © {new Date().getFullYear()} JobResearch AI</p>
        <Link href={'/privacypolicy'}>Privacy Policy</Link>
      </div>
    </footer>
  );
}
