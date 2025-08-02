/**
 * @fileoverview Core application functionality
 * @module components.theme-provider.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

  /**
   * Implements ThemeProvider functionality
   * 
   * @function ThemeProvider
   * @returns {void|Promise<void>} Function return value
   */


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // We'll rely on the script in public/theme-fix.js instead of React effects
  // This removes unnecessary React overhead and improves performance
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}