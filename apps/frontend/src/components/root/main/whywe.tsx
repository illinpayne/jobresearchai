'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function WhyweSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box1Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        box1Ref.current,
        { y: 0 },
        {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            immediateRender: false,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className='flex flex-col overflow-hidden py-20 relative w-300 mx-auto xs:w-auto xs:px-4 lg:w-250 2xl:w-300 lg:px-0'
      ref={containerRef}
      id='whywe'>
      <div className='flex flex-col text-5xl font-semibold mb-10'>
        <h1 className='font-nunito-sans'>
          <span className='font-black text-primary'>Mastered</span> by Experience
        </h1>
        <h1 className='font-nunito-sans'>
          Defined by <span className='font-black text-secondary'>Work</span>.
        </h1>
      </div>
      <div
        className='bg-primary text-white-200 px-20 py-18 [clip-path:polygon(3%_2%,100%_0,98%_99%,0_100%)] parallax-box'
        ref={box1Ref}>
        <h1 className='text-4xl font-nunito-sans'>
          Help us shape <span className='font-black'>the future of your career.</span>
        </h1>
        <Button
          variant={'outline'}
          className='border-2 rounded-2xl text-lg p-5 mt-5 font-nunito-sans font-medium'>
          Upload first resume
        </Button>
      </div>
    </section>
  );
}
