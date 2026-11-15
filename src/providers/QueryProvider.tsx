'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FetchError } from '@/src/utils/fetch';

export interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 минута
            gcTime: 10 * 60 * 1000, // 10 минут
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Не повторяем запросы при ошибках 401/403/404
              if (error instanceof FetchError) {
                if ([401, 403, 404].includes(error.statusCode)) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
