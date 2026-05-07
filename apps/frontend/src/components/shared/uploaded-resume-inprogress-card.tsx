/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import type { QueryClient } from '@tanstack/react-query';
import { Ban, Check, Loader, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { AnalyseJobInProgressDto, SimplifiedAnalyseJobWithPresetResponse } from '@/api/generated';
import { APP_CONFIG, ROUTES } from '@/constants';
import { jobsCacheKey, profilesCacheKey, RemoveCache } from '@/lib/cache';
import { cn } from '@/lib/utils';
import { type AiJoinRoomEventType, type AiProgressExchangeEventType, EventStatusCode, JobStatus, JobStatusMapper } from '@/shared/events';

interface Props extends AnalyseJobInProgressDto {
  workId: number;
  queryClient: QueryClient;
  email?: string;
}

export default function UploadedResumeInProgressCard({ queryClient, email, ...props }: Props) {
  function getProgressStatus(status: string): string {
    if (status === JobStatus.WAITING) {
      return 'In progress';
    } else if (status === JobStatus.INQUEUE) {
      return 'In queue';
    } else if (status === JobStatus.DONE) {
      return 'Done';
    }
    return 'Cancelled';
  }

  function getProgressStyleLabel(status: string) {
    if (status === JobStatus.WAITING) {
      return 'bg-blue-500/5 border-blue-500 text-blue-600';
    } else if (status === JobStatus.DONE) {
      return 'bg-green-500/5 border-green-500 text-green-600';
    } else if (status === JobStatus.INQUEUE) {
      return 'bg-amber-500/5 border-amber-500 text-amber-600';
    }
    return 'bg-red-500/5 border-red-500 text-red-600';
  }

  function getProgressStyleText(status: string) {
    if (status === JobStatus.WAITING) {
      return 'text-blue-600';
    } else if (status === JobStatus.DONE) {
      return 'text-green-600';
    } else if (status === JobStatus.INQUEUE) {
      return 'text-amber-600';
    }
    return 'text-red-600';
  }

  function getProgressStyleContainer(status: string) {
    if (status === JobStatus.WAITING) {
      return 'outline-primary bg-primary/5 hover:outline-primary hover:outline-blue-700';
    } else if (status === JobStatus.DONE) {
      return 'outline-green-500 bg-green-500/5 hover:outline-green-600';
    } else if (status === JobStatus.INQUEUE) {
      return 'outline-amber-500 bg-amber-500/5 hover:outline-amber-600';
    }
    return 'outline-red-500 bg-red-500/5 hover:outline-red-500';
  }
  const [progressStatus, setProgressStatus] = useState<{ message: string; status: JobStatus }>({
    message: 'Connecting...',
    status: props.status as JobStatus,
  });

  function removeCurrentFromJobList(data: AiProgressExchangeEventType) {
    setTimeout(() => {
      const listOfJobs = queryClient.getQueryData<SimplifiedAnalyseJobWithPresetResponse>(['jobsInProgress']);
      const removedJob = {
        jobs: listOfJobs?.jobs.filter((f) => f.id !== data.jobId),
      };
      queryClient.setQueryData(['jobsInProgress'], removedJob);
    }, 1000);
  }

  useEffect(() => {
    if (!props.id || !email) return;

    const socket: Socket = io(APP_CONFIG.wssUrl, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit(
        'listenResumeJob',
        { jobId: props.id, accountEmail: email } as AiJoinRoomEventType,
        (response: AiProgressExchangeEventType) => {
          const status = JobStatusMapper[response.status];

          if (status === JobStatus.CANCELLED) {
            socket.disconnect();
            setProgressStatus({ message: response.lastMessage, status: JobStatus.CANCELLED });
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
          RemoveCache(profilesCacheKey);
          queryClient.refetchQueries({ queryKey: ['profiles'] });
          const { toast } = await import('sonner');
          toast.success(`Job #${props.workId} completed.`);
          await removeCurrentFromJobList(response);

          setProgressStatus({ message: response.lastMessage, status: status });
          return;
        }
        case JobStatus.CANCELLED: {
          socket.disconnect();

          const { toast } = await import('sonner');
          toast.error(`Job #${props.workId} was cancelled.`);

          await removeCurrentFromJobList(response);

          setProgressStatus({ message: 'Unable to process your request fow now!', status: JobStatus.CANCELLED });
          return;
        }

        default:
          break;
      }

      setProgressStatus({ message: response.lastMessage, status: status });
    });

    return () => {
      socket.disconnect();
    };
  }, [props.id, email]);

  function renderLoader() {
    if (progressStatus?.message?.includes('Malformed access') || progressStatus.status === JobStatus.CANCELLED) {
      return <Ban className='size-5' />;
    } else if (progressStatus.status === JobStatus.DONE) {
      return <Check className='size-5' />;
    } else if (progressStatus.status === JobStatus.INQUEUE) {
      return <Loader className='size-5' />;
    }

    return (
      <div className='animate-spin size-5'>
        <LoaderCircle className='size-5' />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all outline group h-auto overflow-hidden relative group',
        getProgressStyleContainer(progressStatus.status),
      )}>
      <div className='w-full flex justify-between items-center max-sm:flex-col max-sm:items-start'>
        <h2 className='text-2xl font-semibold'>#{props.workId}</h2>
        <div>
          <p className={cn('border px-2 text-sm rounded', getProgressStyleLabel(progressStatus.status))}>
            {getProgressStatus(progressStatus.status)}
          </p>
        </div>
      </div>
      <div className='flex gap-3 mt-3'>
        {renderLoader()}
        <p className={cn('text-sm text-balance animate-pulse', getProgressStyleText(progressStatus.status))}>{progressStatus.message}</p>
      </div>
      <div className='flex mt-3 items-center gap-5 z-10'>
        <p className={cn('text-sm text-neutral-600 text-balance')}>{props.presetName}</p>
        <Link
          href={ROUTES.OVERVIEW.JOB_IN_PROGRESS(props.id)}
          className='text-sm text-blue-500 hover:text-blue-600 transition-all ml-auto cursor-pointer opacity-0 group-hover:opacity-100'>
          Open
        </Link>
      </div>
      <div className='absolute bottom-0 right-0 -z-10 opacity-15'>
        <div className='ai-fluid-container'>
          <div className='ai-orb orb-magenta'></div>
          <div className='ai-orb orb-purple'></div>
          <div className='ai-orb orb-cyan'></div>
        </div>
      </div>
    </div>
  );
}
