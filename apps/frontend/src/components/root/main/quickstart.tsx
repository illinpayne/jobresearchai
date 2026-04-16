'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function QuickStartSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollDistance = 3000;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top 60px',
          end: `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      tl.to(trackRef.current, {
        x: '-100vw',
        ease: 'none',
        duration: 3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id='quick-start'
      className='relative w-full h-[calc(100vh-60px)] overflow-hidden bg-linear-to-b from-neutral-100 to-white'>
      <div
        ref={trackRef}
        className='flex h-full w-[300vw] will-change-transform'>
        <div className='w-screen h-full flex justify-center items-center font-nunito-sans relative'>
          <div
            className='bg-primary/10 size-160 absolute top-[50%] -left-80 -translate-y-[50%] xs:hidden lg:block lg:-left-100 3xl:-left-80 xl:size-160'
            style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}></div>
          <div
            className='bg-emerald-500/10 size-160 absolute top-[50%] -right-80 -translate-y-[50%] xs:hidden xl:block xl:size-140 2xl:size-160'
            style={{
              clipPath: 'polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)',
            }}></div>
          <div className='grid grid-cols-2 gap-14 z-10 xs:grid-cols-1 xl:grid-cols-2 xs:px-4'>
            <div className='flex flex-col justify-center gap-2'>
              <div className='flex items-center gap-4'>
                <Image
                  src='/images/icon.webp'
                  width={34}
                  height={34}
                  alt='logo'
                />
                <p className='text-4xl font-bold'>Creation</p>
              </div>
              <h2 className='text-3xl font-inter'>
                Upload your resume for <span className='font-bold'>AI review</span>
              </h2>
              <p className='text-xl text-neutral-900'>
                Write your first CV and upload it <span className='font-bold'>on a dashboard</span>
              </p>
              <Button
                className='w-fit text-lg p-5 mt-5 hover:bg-primary hover:text-white border-primary'
                variant={'outline'}>
                Upload for review
              </Button>
            </div>
            <div
              className='p-20 bg-neutral-200 xs:hidden xl:block'
              style={{ clipPath: 'polygon(3% 3%, 100% 0, 99% 96%, 0% 100%)' }}>
              <Image
                src={'https://img.freepik.com/premium-vector/image-upload-concept-illustration_114360-798.jpg'}
                width={400}
                height={400}
                alt='upload'
                className='w-full h-[20rem] mix-blend-multiply'
              />
            </div>
          </div>
        </div>
        <div className='w-screen h-full flex justify-center items-center font-nunito-sans relative'>
          <div
            className='bg-primary/10 size-160 absolute top-[50%] -right-90 -translate-y-[50%] xs:hidden lg:block xl:-right-120 3xl:-right-90'
            style={{
              clipPath:
                'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)',
            }}></div>
          <div className='z-10 flex flex-col gap-2 xs:px-4'>
            <div className='flex items-center gap-4'>
              <Image
                src='/images/icon.webp'
                width={34}
                height={34}
                alt='logo'
              />
              <p className='text-4xl font-bold'>Review</p>
            </div>
            <h2 className='text-3xl font-inter'>
              Get the fresh vacancies{' '}
              <span className='font-bold relative ml-4 text-white before:content-["_"] before:scale-110 before:bg-primary before:-rotate-1 before:z-[-1] before:absolute before:w-full before:h-full xs:block md:inline'>
                where you are the best
              </span>
            </h2>
            <p className='text-xl text-neutral-900'>
              Write your first CV and upload it <span className='font-bold'>on a dashboard</span>
            </p>
            <Button
              className='w-fit text-lg p-5 mt-5 hover:bg-primary hover:text-white border-primary'
              variant={'outline'}>
              See related vacancies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
