"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingAnimation } from "@/components/loading-animation";
import { Github, Wallet, ArrowRight, BookOpen } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        // Redirect to home page after successful login
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        alert('Please install MetaMask to use this feature!');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      alert('Failed to connect to MetaMask.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 rounded-full theme-gradient-bg animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <span className="text-2xl font-bold gradient-heading">GT</span>
          </div>
        </div>
        <LoadingAnimation message="Welcome to GroqTales" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating doodles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-teal-200 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-float-slow"></div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full theme-gradient-bg flex items-center justify-center">
            <span className="text-lg font-bold text-white">GT</span>
          </div>
          <span className="text-xl font-bold">GroqTales</span>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between relative z-10">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Share Your Stories in the <span className="gradient-heading">Web3</span> Era
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            GroqTales is a decentralized platform where storytellers can create, share, and monetize their content through NFTs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {account ? (
              <Button size="lg" className="theme-gradient-bg text-white border-0 hover:opacity-90" asChild>
                <Link href="/">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Enter App
                </Link>
              </Button>
            ) : (
              <Button size="lg" onClick={connectWallet} disabled={isConnecting} className="theme-gradient-bg text-white border-0 hover:opacity-90">
                {isConnecting ? (
                  <LoadingAnimation message="Connecting..." />
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect with MetaMask
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="/community">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Stories
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-0.5 theme-gradient-bg rounded-lg blur opacity-30"></div>
            <div className="relative bg-card border border-border p-6 rounded-lg shadow-xl">
              <div className="aspect-[4/3] relative mb-4 overflow-hidden rounded-md bg-muted">
                <div className="absolute inset-0 theme-gradient-bg opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl text-muted-foreground">Story Preview</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
                <div className="h-8 w-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features section */}
      <section className="bg-muted/30 py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-heading">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 mb-4 rounded-full theme-gradient-bg opacity-80 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Decentralized Stories</h3>
              <p className="text-muted-foreground">Create and share your stories on a decentralized platform that you own.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 mb-4 rounded-full theme-gradient-bg opacity-80 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">NFT Integration</h3>
              <p className="text-muted-foreground">Turn your best stories into NFTs and monetize your creative work.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 mb-4 rounded-full theme-gradient-bg opacity-80 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Access</h3>
              <p className="text-muted-foreground">Browse stories anonymously or connect with wallet for full features.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 