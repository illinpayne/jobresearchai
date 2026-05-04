/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { ROUTES } from '@/constants';

interface ThinkingScreenProps {
  activeJobId: string | null;
  animateEntrance?: boolean;
  accountId: string | null;
}

export const ThinkingScreen = React.memo(function ThinkingScreen({ activeJobId, accountId, animateEntrance = false }: ThinkingScreenProps) {
  const thinkingRef = useRef<HTMLDivElement>(null);
  const [progressStatus, setProgressStatus] = useState('Connecting to service...');
  const router = useRouter();

  useEffect(() => {
    if (!activeJobId || !accountId) return;

    const socket: Socket = io('http://localhost:5000/progress', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('joinJobRoom', { jobId: activeJobId, accountId });
    });

    socket.on('progressUpdate', (statusMessage: string) => {
      if (statusMessage === 'Done') {
        setProgressStatus('Complete!');
        socket.disconnect();

        setTimeout(() => router.push(ROUTES.OVERVIEW.RESUMES), 1000);
      } else {
        setProgressStatus(statusMessage);
      }
    });

    socket.on('error', (err: { message: string }) => {
      setProgressStatus(`Malformed request`);
      router.push(ROUTES.OVERVIEW.RESUMES);
      socket.disconnect();
    });
    return () => {
      socket.disconnect();
    };
  }, [activeJobId, accountId, router]);

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
