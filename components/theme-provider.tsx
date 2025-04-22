"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // We'll rely on the script in public/theme-fix.js instead of React effects
  // This removes unnecessary React overhead and improves performance
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}