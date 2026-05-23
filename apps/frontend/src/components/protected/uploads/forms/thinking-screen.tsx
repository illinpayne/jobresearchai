/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import { useQueryClient } from '@tanstack/react-query';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { APP_CONFIG, ROUTES } from '@/constants';
import { billingSubscriptionCacheKey, jobsCacheKey, profilesCacheKey, RemoveCache } from '@/lib/cache';
import { type AiJoinRoomEventType, type AiProgressExchangeEventType, JobStatus, JobStatusMapper } from '@/shared/events';
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
      socket.emit(
        'listenResumeJob',
        { jobId: activeJobId, accountEmail } as AiJoinRoomEventType,
        (response: AiProgressExchangeEventType) => {
          const status = JobStatusMapper[response.status];

          if (status === JobStatus.CANCELLED) {
            socket.disconnect();
            setProgressStatus({ message: response.lastMessage, status: JobStatus.CANCELLED });
            router.replace(ROUTES.OVERVIEW.RESUMES);
            return;
          }

          setProgressStatus({
            message: response.lastMessage,
            status: JobStatusMapper[response.status],
          });
        },
      );
    });

    socket.on('updateResumeJob', async (response: AiProgressExchangeEventType) => {
      const status = JobStatusMapper[response.status];

      // Done/Error cases
      switch (status) {
        case JobStatus.DONE: {
          socket.disconnect();
          setProgressStatus({ message: 'Complete', status: status });

          RemoveCache(profilesCacheKey);
          RemoveCache(jobsCacheKey);
          RemoveCache(billingSubscriptionCacheKey);
          queryClient.refetchQueries({ queryKey: ['jobsInProgress'] });
          queryClient.refetchQueries({ queryKey: ['profiles'] });
          queryClient.refetchQueries({ queryKey: ['jobs'] });
          queryClient.refetchQueries({ queryKey: ['jobs-filter'] });
          queryClient.refetchQueries({ queryKey: ['billing-subscription'] });

          const { toast } = await import('sonner');
          toast.success(`Analyse completed`);

          setTimeout(() => {
            router.replace(ROUTES.OVERVIEW.RESUMES);
          }, 1000);
          return;
        }
        case JobStatus.CANCELLED:
          socket.disconnect();
          setProgressStatus({ message: response.lastMessage, status: status });
          setTimeout(() => {
            router.replace(ROUTES.OVERVIEW.NEW_RESUME);
          }, 1000);
          return;

        default:
          break;
      }

      setProgressStatus({ message: response.lastMessage, status: status });
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
