'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

export function TanstackQueryProvider({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: 3,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
      },
    },
  });
  // const [client] = useState(
  //   new QueryClient({
  //     defaultOptions: {
  //       queries: {
  //         staleTime: Infinity,
  //         retry: 3,
  //         refetchInterval: false,
  //         refetchOnWindowFocus: false,
  //         refetchOnReconnect: false,
  //         refetchOnMount: false,
  //       },
  //     },
  //   }),
  // );

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* <ReactQueryDevtools></ReactQueryDevtools> */}
    </QueryClientProvider>
  );
}
