"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "@/components/user-nav";
import { PenSquare, Users, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  // Define active class for navigation links
  const isActive = (path: string) => {
    return pathname === path ? "theme-gradient-bg text-white" : "hover:bg-accent/10";
  };

  return (
    <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-8">
            <span className="text-xl font-bold gradient-heading">GroqTales</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/stories" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/stories')}`}
            >
              Stories
            </Link>
            <Link 
              href="/genres" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/genres')}`}
            >
              Genres
            </Link>
            <Link 
              href="/community" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${isActive('/community')}`}
            >
              <Users className="h-4 w-4 mr-1" />
              Community
            </Link>
            <Link 
              href="/nft-gallery" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/nft-gallery')}`}
            >
              NFT Gallery
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/create">
            <Button 
              variant="default" 
              size="sm" 
              className="hidden md:flex items-center theme-gradient-bg text-white border-0 hover:opacity-90"
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Create
            </Button>
          </Link>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}