"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./splash-screen";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem("hasVisitedGroqTales");
    
    if (!hasVisited) {
      setIsFirstVisit(true);
      sessionStorage.setItem("hasVisitedGroqTales", "true");
    } else {
      // If not first visit, skip splash screen
      setShowSplash(false);
    }
    
    // Add a class to enable animations once splash screen completes
    if (!showSplash) {
      document.documentElement.classList.add("content-loaded");
    }
  }, []);
  
  // Handle the splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    document.documentElement.classList.add("content-loaded");
  };
  
  // Only show splash on the homepage for first visit
  const shouldShowSplash = showSplash && isFirstVisit && pathname === "/";
  
  return (
    <>
      {shouldShowSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {children}
    </>
  );
} 