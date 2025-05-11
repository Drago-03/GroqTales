"use client";

import { ReactNode } from "react";
import { GalaxyBackground } from "@/components/galaxy-background";
import { cn } from "@/lib/utils";

interface AnimatedLayoutProps {
  children: ReactNode;
  disableAnimation?: boolean;
  className?: string;
}

export function AnimatedLayout({ 
  children, 
  disableAnimation = false,
  className 
}: AnimatedLayoutProps) {
  return (
    <div className="relative min-h-screen w-full">
      {/* fr fr this galaxy background be bussin no cap */}
      {!disableAnimation && <GalaxyBackground />}
      
      {/* lowkey making sure the text stays readable n stuff */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-none" />
      
      {/* no cap this where the content goes */}
      <div className={cn(
        "relative z-10 min-h-screen w-full",
        className
      )}>
        {children}
      </div>
    </div>
  );
} 