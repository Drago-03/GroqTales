"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "@/components/user-nav";
import { PenSquare, Users, Sparkles, BookOpen, ChevronDown, BookText, Camera, Palette } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { CreateStoryDialog } from "./create-story-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { account } = useWeb3();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCreateType, setSelectedCreateType] = useState<'text' | 'image' | 'comic' | 'art' | null>(null);
  
  // Track scroll position for adding box shadow to header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Define active class for navigation links
  const isActive = (path: string) => {
    return pathname === path ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/10 text-muted-foreground";
  };

  const handleCreateClick = (type?: 'text' | 'image' | 'comic' | 'art') => {
    // Check if user is authenticated
    const isAdmin = localStorage.getItem('adminSession');
    
    if (!account && !isAdmin) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet or login as admin to create stories",
        variant: "destructive",
      });
      return;
    }

    if (type) {
      setSelectedCreateType(type);
      
      // Store the selection in localStorage
      localStorage.setItem('storyCreationData', JSON.stringify({
        type: type,
        timestamp: new Date().getTime()
      }));
      
      if (type === 'text') {
        window.location.href = '/create/ai-story';
      } else {
        window.location.href = '/create';
      }
    } else {
      setShowCreateDialog(true);
    }
  };

  return (
    <header className={cn(
      "border-b backdrop-blur-sm bg-background/90 sticky top-0 z-50 transition-all duration-200",
      scrolled && "shadow-sm"
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-8 group">
            <div className="w-10 h-10 rounded-full theme-gradient-bg flex items-center justify-center transition-transform group-hover:scale-110">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-heading">GroqTales</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/stories" 
              className={`px-4 py-2 text-sm rounded-md transition-colors ${isActive('/stories')}`}
            >
              Stories
            </Link>
            <Link 
              href="/genres" 
              className={`px-4 py-2 text-sm rounded-md transition-colors ${isActive('/genres')}`}
            >
              Genres
            </Link>
            <Link 
              href="/community" 
              className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center ${isActive('/community')}`}
            >
              <Users className="h-4 w-4 mr-1.5" />
              Community
            </Link>
            <Link 
              href="/nft-gallery" 
              className={`px-4 py-2 text-sm rounded-md transition-colors ${isActive('/nft-gallery')}`}
            >
              NFT Gallery
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                className="hidden md:flex items-center theme-gradient-bg text-white border-0 hover:opacity-90"
              >
                <PenSquare className="mr-2 h-4 w-4" />
                Create
                <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleCreateClick('text')} className="cursor-pointer">
                <BookText className="mr-2 h-4 w-4" />
                <span>Text Story (AI-Powered)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateClick('image')} className="cursor-pointer">
                <Camera className="mr-2 h-4 w-4" />
                <span>Story with Images</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateClick('comic')} className="cursor-pointer">
                <Palette className="mr-2 h-4 w-4" />
                <span>Visual Story</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowCreateDialog(true)} className="cursor-pointer">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Advanced Options</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="default" 
            size="icon"
            className="md:hidden theme-gradient-bg text-white border-0 hover:opacity-90"
            onClick={() => setShowCreateDialog(true)}
          >
            <PenSquare className="h-4 w-4" />
          </Button>
          
          <ThemeToggle />
          <UserNav />
        </div>
      </div>

      <CreateStoryDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </header>
  );
}