"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingAnimation } from "@/components/loading-animation";

interface Web3ContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
});

export const useWeb3 = () => useContext(Web3Context);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/landing', '/community', '/explore', '/stories', '/about', '/privacy', '/terms'];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/stories/');

  // Handle account changes in MetaMask
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        localStorage.removeItem('walletConnected');
        if (!isPublicRoute && pathname !== '/landing') {
          router.push('/landing');
        }
      } else {
        setAccount(accounts[0]);
        localStorage.setItem('walletConnected', 'true');
      }
    };

    const checkConnection = async () => {
      try {
        const wasConnected = localStorage.getItem('walletConnected') === 'true';
        
        if (wasConnected && typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            localStorage.removeItem('walletConnected');
            if (!isPublicRoute && pathname !== '/landing') {
              router.push('/landing');
            }
          }
        } else if (!isPublicRoute && pathname !== '/landing') {
          router.push('/landing');
        }
      } catch (error) {
        console.error('Error checking connection', error);
      } finally {
        setInitialLoading(false);
      }
    };

    // Check initial connection
    checkConnection();

    // Setup listeners
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [pathname, router, isPublicRoute]);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature!');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      localStorage.setItem('walletConnected', 'true');
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      alert('Failed to connect to MetaMask.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem('walletConnected');
    router.push('/landing');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation message="Initializing" />
      </div>
    );
  }

  return (
    <Web3Context.Provider value={{ account, connectWallet, disconnectWallet, isConnecting }}>
      {children}
    </Web3Context.Provider>
  );
}