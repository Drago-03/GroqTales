'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { ClientOnly } from '@/components/client-only';

import SplashScreen from './splash-screen';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage?.getItem('hasVisitedGroqTales');

    if (!hasVisited) {
      setIsFirstVisit(true);
      sessionStorage?.setItem('hasVisitedGroqTales', 'true');
    } else {
      // If not first visit, skip splash screen
      setShowSplash(false);
    }
    // Add a class to enable animations once splash screen completes
    if (!showSplash && typeof document !== 'undefined') {
      document.documentElement.classList.add('content-loaded');
    }
  }, [showSplash]);

  // Handle the splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('content-loaded');
    }
  };

  // Only show splash on the homepage for first visit
  const shouldShowSplash = showSplash && isFirstVisit && pathname === '/';

  return (
    <ClientOnly fallback={<>{children}</>}>
      {shouldShowSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {children}
    </ClientOnly>
  );
}
