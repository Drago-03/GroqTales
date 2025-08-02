/**
 * @fileoverview Core application functionality
 * @module components.query-provider.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

  /**
   * Implements QueryProvider functionality
   * 
   * @function QueryProvider
   * @returns {void|Promise<void>} Function return value
   */


export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}