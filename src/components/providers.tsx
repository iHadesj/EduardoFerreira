"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LenisProvider } from "@/components/layout/lenis-provider";

/**
 * Global client providers, in the §F2 order:
 * ThemeProvider → QueryProvider → MotionConfig → Lenis → children.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 60 * 1000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "light", "underworld"]}
    >
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          <LenisProvider>{children}</LenisProvider>
        </MotionConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
