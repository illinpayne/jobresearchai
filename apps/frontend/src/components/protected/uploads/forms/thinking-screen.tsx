/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ROUTES } from '@/constants';

interface ThinkingScreenProps {
  activeJobId: string | null;
  animateEntrance?: boolean;
}
export const ThinkingScreen = React.memo(function ThinkingScreen({ activeJobId, animateEntrance = false }: ThinkingScreenProps) {
  const thinkingRef = useRef<HTMLDivElement>(null);
  const [progressStatus, setProgressStatus] = useState('Initializing AI Engine...');
  const router = useRouter();

  useEffect(() => {
    if (!activeJobId) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress === 25) setProgressStatus('Extracting Document Vectors...');
      if (progress === 50) setProgressStatus('Running Semantic Analysis...');
      if (progress === 75) setProgressStatus('Synthesizing Final Output...');
      if (progress === 100) {
        setProgressStatus('Complete!');
        clearInterval(interval);
        setTimeout(() => router.push(ROUTES.OVERVIEW.RESUMES), 1000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeJobId]);

  useEffect(() => {
    if (!animateEntrance) return;

    const ctx = gsap.context(() => {
      if (thinkingRef.current) {
        gsap.fromTo(
          thinkingRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        );
      }
    });
    return () => ctx.revert();
  }, [animateEntrance]);

  return (
    <div
      ref={thinkingRef}
      className='flex flex-col items-center justify-center absolute inset-0 z-20'>
      <div className='ai-fluid-container'>
        <div className='ai-orb orb-magenta'></div>
        <div className='ai-orb orb-purple'></div>
        <div className='ai-orb orb-cyan'></div>
      </div>
      <div className='mt-8 flex flex-col items-center'>
        <p className='text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-fuchsia-600 font-medium tracking-wide animate-pulse'>
          {progressStatus}
        </p>
        <p className='text-xs text-neutral-400 mt-1 font-mono tracking-widest uppercase'>
          AI Engine Active • {activeJobId ? 'Processing' : 'Connecting'}
        </p>
      </div>
    </div>
  );
});
