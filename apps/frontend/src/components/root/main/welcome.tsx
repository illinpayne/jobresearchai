'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function WelcomeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        box1Ref.current,
        { y: -100 },
        {
          y: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        box2Ref.current,
        { x: 200 },
        {
          x: -200,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className='h-screen flex flex-col items-center justify-start py-[10vh] overflow-hidden relative bg-linear-to-b from-white via-white to-neutral-100 xs:justify-center sm:justify-start'
      ref={containerRef}>
      <div className='flex flex-col items-center text-6xl font-semibold text-center mb-10 z-10'>
        <h1 className='font-nunito-sans'>Tool that really</h1>
        <h1 className='font-nunito-sans text-center'>
          <div className='font-black text-primary relative inline-block'>
            help{' '}
            <Image
              src={'/assets/hyphen.svg'}
              width={100}
              height={30}
              alt='some'
              className='scale-120 translate-x-3 absolute -bottom-3.75'
            />
          </div>{' '}
          you in difficult time
        </h1>
      </div>
      <p className='font-nunito-sans font-medium text-lg text-neutral-800 text-center z-10'>
        Explore the tool for find the job of your dream faster with AI.
      </p>
      <p className='font-nunito-sans font-medium text-lg text-neutral-800 text-center z-10'>Find and save vacancies you want.</p>
      <div className='mt-10 z-10'>
        <Link href={'/overview'}>
          <Button className='rounded-xl text-xl p-6 font-semibold font-nunito-sans'>Get started</Button>
        </Link>
      </div>
      <div
        className='absolute bottom-[-40%] left-0 w-full flex justify-center parallax-box z-10 xs:hidden sm:flex'
        ref={box1Ref}>
        <Image
          src={'/resumes/res3.webp'}
          width={500}
          height={500}
          alt='res1'
          className='w-auto h-[80vh] rounded-t translate-y-10 xs:hidden 2xl:block'
          priority
        />
        <Image
          src={'/resumes/res2.webp'}
          width={500}
          height={500}
          alt='res1'
          className='w-auto h-[80vh] rounded-t'
          priority
        />
        <Image
          src={'/resumes/res2.jpg'}
          width={500}
          height={500}
          alt='res1'
          className='w-auto h-[80vh] rounded-t translate-y-30 xs:hidden 2xl:block'
          priority
        />
      </div>
      <div
        className='absolute top-0 -left-[20%] size-160 rounded-full border-2 border-primary parallax-box xs:hidden xl:block xs:-left-[36%] 2xl:-left-[20%]'
        ref={box2Ref}></div>
      <div className='absolute -top-40 -left-[16%] size-160 rounded-full border-2 border-emerald-500 xs:hidden xl:block xs:-left-[30%] 2xl:-left-[16%]'></div>

      <div
        className='absolute -bottom-5 -right-[18%] size-160 bg-blue-500/10 xs:hidden xl:block xl:-right-[24%] 2xl:-right-[18%]'
        style={{ clipPath: 'polygon(4% 4%, 100% 0, 100% 100%, 0% 100%)' }}></div>
      <div
        className='absolute bottom-10 -right-[22%] size-160 bg-secondary/10 xs:hidden xl:block xl:-right-[28%] 2xl:-right-[22%]'
        style={{ clipPath: 'polygon(0 0, 100% 4%, 100% 100%, 7% 100%)' }}></div>
      <div
        className='absolute bottom-20 -right-[25%] size-160 bg-emerald-500/10 xs:hidden xl:block xl:-right-[32%] 2xl:-right-[25%]'
        style={{ clipPath: 'polygon(2% 3%, 100% 0, 100% 100%, 0 100%)' }}></div>
    </section>
  );
}
