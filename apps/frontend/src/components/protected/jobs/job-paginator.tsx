// components/job-pagination.tsx

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function JobPagination({ totalCount, pageSize, currentPage }: { totalCount: number; pageSize: number; currentPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => `?page=${page}&limit=${pageSize}`;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    const buffer = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - buffer && i <= currentPage + buffer)) {
        pages.push(i);
      } else if (i === currentPage - buffer - 1 || i === currentPage + buffer + 1) {
        pages.push('...');
      }
    }

    return pages.filter((item, index) => item !== '...' || pages[index - 1] !== '...');
  };

  const pages = getPages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageUrl(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page as number)}
                isActive={currentPage === page}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={getPageUrl(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
