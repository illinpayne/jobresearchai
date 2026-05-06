/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import { useQueryClient } from '@tanstack/react-query';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { APP_CONFIG, ROUTES } from '@/constants';
import { jobsCacheKey, profilesCacheKey, RemoveCache } from '@/lib/cache';
import { type AiProgressExchangeEventType, EventStatusCode } from '@/shared/events';
import { type JobJoinedRoom, JobStatus, JobStatusMapper, type JobUpdatesRoom } from '@/shared/jobs';
import { useAIStore } from '@/states/useAiStorage.hook';

interface ThinkingScreenProps {
  activeJobId: string | null;
  animateEntrance?: boolean;
  accountEmail?: string;
}

export const ThinkingScreen = React.memo(function ThinkingScreen({
  activeJobId,
  accountEmail,
  animateEntrance = false,
}: ThinkingScreenProps) {
  const thinkingRef = useRef<HTMLDivElement>(null);
  const [progressStatus, setProgressStatus] = useState({ message: 'Connecting...', status: JobStatus.INQUEUE });
  const router = useRouter();
  const { name: aiName } = useAIStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!activeJobId || !accountEmail) return;

    const socket: Socket = io(APP_CONFIG.wssUrl, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('joinJobRoom', { jobId: activeJobId, accountEmail });
    });

    socket.on('roomJoined', (data: JobJoinedRoom) => {
      setProgressStatus({ message: data.lastMessage, status: JobStatusMapper[data.status] });
    });

    socket.on('progressUpdate', async (data: JobUpdatesRoom) => {
      if (data.status === EventStatusCode.DONE) {
        setProgressStatus({ message: 'Complete', status: JobStatusMapper[data.status] });
        socket.disconnect();

        RemoveCache(profilesCacheKey);
        RemoveCache(jobsCacheKey);
        queryClient.refetchQueries({ queryKey: ['jobsInProgress'] });
        queryClient.refetchQueries({ queryKey: ['profiles'] });

        const { toast } = await import('sonner');
        toast.success(`Analyse completed`);

        setTimeout(() => {
          router.push(ROUTES.OVERVIEW.RESUMES);
        }, 1000);
      } else if (data.status === EventStatusCode.CANCELLED) {
        socket.disconnect();
        setProgressStatus({ message: 'Unable to process your request fow now!', status: JobStatusMapper[data.status] });
        setTimeout(() => {
          router.replace(ROUTES.OVERVIEW.NEW_RESUME);
        }, 1000);
      } else {
        setProgressStatus({ message: data.lastMessage, status: JobStatusMapper[data.status] });
      }
    });

    socket.on('error', (err: { message: string }) => {
      socket.disconnect();
      setProgressStatus({ message: err.message, status: JobStatus.CANCELLED });
      router.push(ROUTES.OVERVIEW.RESUMES);
    });
    return () => {
      socket.disconnect();
    };
  }, [activeJobId, accountEmail, router]);

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

  function getProcessingStatus(status: JobStatus) {
    if (status === JobStatus.WAITING) {
      return 'Processing';
    } else if (status === JobStatus.INQUEUE) {
      return 'In queue';
    } else if (status === JobStatus.DONE) {
      return 'Done';
    }
    return 'Cancelled';
  }

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
          {progressStatus.message}
        </p>
        <p className='text-xs text-neutral-400 mt-1 font-mono tracking-widest uppercase'>
          {aiName ?? 'AI'} • {activeJobId ? getProcessingStatus(progressStatus.status) : 'Connecting'}
        </p>
      </div>
    </div>
  );
});
