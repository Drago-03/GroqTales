"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "@/components/user-nav";
import { PenSquare, Users, BookOpen, FlaskConical, ChevronDown, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { CreateStoryDialog } from "./create-story-dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type definitions for nav items
type NavSubItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type NavItem = {
  href?: string;
  label: string;
  icon?: React.ReactNode;
  type?: 'link' | 'dropdown';
  items?: NavSubItem[];
};

export function Header() {
  const pathname = usePathname();
  const { account } = useWeb3();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll position for adding box shadow to header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Define active class for navigation links
  const isActive = (path: string) => {
    if (path === '/community') {
      return pathname === '/community' || pathname === '/community/creators' 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-accent/20 text-muted-foreground";
    }
    return pathname === path ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/20 text-muted-foreground";
  };

  const handleCreateClick = () => {
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

    setShowCreateDialog(true);
  };

  const navItems: NavItem[] = [
    { type: 'link', href: "/genres", label: "Genres" },
    { type: "dropdown", label: "Community", icon: <Users className="h-4 w-4 mr-1.5" />, items: [
      { href: "/community", label: "Community Hub" },
      { href: "/community/creators", label: "Top Creators", icon: <Trophy className="h-4 w-4 mr-1.5" /> }
    ]},
    { type: 'link', href: "/nft-gallery", label: "NFT Gallery" },
    { type: 'link', href: "/nft-marketplace", label: "NFT Marketplace" }
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "border-b backdrop-blur-sm bg-background/90 sticky top-0 z-50 transition-all duration-300",
        scrolled && "shadow-md"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-8 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-10 h-10 rounded-full theme-gradient-bg flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold gradient-heading">GroqTales</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.type === "dropdown" ? `dropdown-${item.label}` : (item.href || `item-${index}`)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.1, duration: 0.2 }}
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center"
              >
                {item.type === "dropdown" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className={`px-4 py-2 text-sm rounded-md transition-all duration-200 flex items-center ${isActive('/community')} hover:scale-105`}>
                      {item.icon}
                      {item.label}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.items?.map((subItem) => (
                        <DropdownMenuItem key={subItem.href} asChild>
                          <Link 
                            href={subItem.href} 
                            className="flex items-center w-full"
                          >
                            {subItem.icon && subItem.icon}
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : item.href ? (
                  <Link 
                    href={item.href} 
                    className={`px-4 py-2 text-sm rounded-md transition-all duration-200 flex items-center ${isActive(item.href)} hover:scale-105`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : null}
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
        </div>
      </div>

      <CreateStoryDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </motion.header>
  );
}