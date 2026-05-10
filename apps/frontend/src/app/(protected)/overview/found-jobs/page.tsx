import type { Metadata } from 'next';
import JobDataWrapper from './data-wrapper';

export const metadata: Metadata = {
  title: 'Related jobs for you',
};

export default async function FoundJobsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;

  // const currentPage = page ?? '1';
  // const currentLimit = limit ?? '10';

  const filter = {
    chunk: {
      page: Number(params.page ?? '1'),
      limit: Number(params.limit ?? '10'),
    },
    positions: params.positions?.split(',').filter(Boolean),
    locations: params.locations?.split(',').filter(Boolean),
    services: params.services?.split(',').filter(Boolean),
    salaryFrom: params.salaryFrom ? Number(params.salaryFrom) : undefined,
    salaryTo: params.salaryTo ? Number(params.salaryTo) : undefined,
  };

  return <JobDataWrapper filter={filter} />;
}
