"use client";

import { ReactNode } from "react";
import { GalaxyBackground } from "@/components/galaxy-background";
import { cn } from "@/lib/utils";

interface AnimatedLayoutProps {
  children: ReactNode;
  disableAnimation?: boolean;
  className?: string;
}

  /**
   * Implements AnimatedLayout functionality
   * 
   * @function AnimatedLayout
   * @returns {void|Promise<void>} Function return value
   */


export function AnimatedLayout({ 
  children, 
  disableAnimation = false,
  className 
}: AnimatedLayoutProps) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Animated galaxy background */}
      {!disableAnimation && <GalaxyBackground />}
      
      {/* Overlay to ensure content readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Main content container */}
      <div className={cn(
        "relative z-10 min-h-screen w-full",
        className
      )}>
        {children}
      </div>
    </div>
  );
} 