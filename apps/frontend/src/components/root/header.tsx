'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import HeaderLoginButton from './header-login-button';

export const navigations = [
  {
    title: 'Home',
    href: '/#home',
  },
  {
    title: 'Quick start',
    href: '/#quick-start',
  },
  {
    title: 'Why we?',
    href: '/#whywe',
  },
  {
    title: 'Faq',
    href: '/#faq',
  },
  {
    title: 'Pricing',
    href: '/#pricing',
  },
];

export default function Header() {
  const router = useRouter();

  return (
    <header className='sticky top-0 left-0 bg-white z-50 flex px-10 items-center justify-center h-15 gap-30 xs:px-4 xs:justify-between xl:justify-center'>
      <div className='flex gap-20 items-center h-full'>
        <div className='flex gap-2 items-center select-none'>
          <Image
            src={'/images/icon.webp'}
            width={30}
            height={30}
            alt='logo'
          />
          <span className='font-black text-3xl text-primary font-angry leading-0 tracking-wide translate-y-1 xs:block xs:text-xl sm:hidden lg:block lg:text-3xl'>
            jobresearch
          </span>
        </div>
        <nav className='list-none flex h-full items-center gap-10 font-semibold font-nunito-sans xs:hidden md:flex'>
          {navigations.map((f, i) => (
            <li
              key={`${f.title}_${i}`}
              onClick={() => {
                router.push(f.href);
              }}
              className='hover:text-blue-500 cursor-pointer'>
              {f.title}
            </li>
          ))}
        </nav>
      </div>
      <HeaderLoginButton />
    </header>
  );
}
