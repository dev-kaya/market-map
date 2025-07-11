'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import MarketMap from '@/components/MarketMap';
import Header from '@/components/Header';

export default function Home() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-2">
              🇨🇿🇸🇰🇵🇱 CEE Market Map
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Discover leading tech companies in Central and Eastern Europe. 
              Explore innovative startups and scale-ups from Czechia, Slovakia, and Poland.
            </p>
          </header>
          <MarketMap />
        </div>
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}