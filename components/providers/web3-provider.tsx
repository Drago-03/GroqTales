"use client";

import { createContext, useContext, useState, useEffect, ReactNode, lazy, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { BrowserProvider } from "ethers";

// Lazy load heavy components
const LoadingAnimation = lazy(() => import("@/components/loading-animation").then(mod => ({ default: mod.LoadingAnimation })));

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
  isBrowserSupported: boolean;
  isWalletInstalled: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  switchNetwork: async () => {},
  isBrowserSupported: true,
  isWalletInstalled: false,
});

export const useWeb3 = () => useContext(Web3Context);

// Constants
const SUPPORTED_CHAIN_IDS = [1, 137]; // Ethereum Mainnet and Polygon
const DEFAULT_CHAIN_ID = 1;
const PUBLIC_ROUTES = ['/landing', '/community', '/explore', '/stories', '/about', '/privacy', '/terms', '/genres', '/nft-gallery'];

// Check if browser is supported - defer this check
const checkBrowserSupport = () => {
  if (typeof window === 'undefined') return true;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  return !isSafari;
};

// Check if any supported wallet is installed - defer this check
const checkWalletInstallation = () => {
  return typeof window !== 'undefined' && (
    typeof window.ethereum !== 'undefined' ||
    typeof (window as any).coinbaseWallet !== 'undefined' ||
    typeof (window as any).walletConnect !== 'undefined'
  );
};

// Extend the window interface
/*
declare global {
  interface Window {
    ethereum?: {
      request(args: { method: string; params?: any[] }): Promise<any>;
      on(event: string, callback: (params: any) => void): void;
      removeListener(event: string, callback: (params: any) => void): void;
      isMetaMask?: boolean;
    };
  }
}
*/

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false); // Change default to false for better UX
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Check if current route is public - memoize this
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname?.startsWith('/stories/') || true;

  // Defer non-critical checks until after first render
  useEffect(() => {
    // Use requestIdleCallback for non-critical operations
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        setIsBrowserSupported(checkBrowserSupport());
        setIsWalletInstalled(checkWalletInstallation());
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      const timeoutId = setTimeout(() => {
        setIsBrowserSupported(checkBrowserSupport());
        setIsWalletInstalled(checkWalletInstallation());
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Handle account changes - optimization with cleanup and passive events
  useEffect(() => {
    // Skip ethereum checks if not available
    if (typeof window === 'undefined' || !window.ethereum) {
      setInitialLoading(false);
      return;
    }

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

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      
      if (!SUPPORTED_CHAIN_IDS.includes(newChainId)) {
        toast({
          title: "Unsupported Network",
          description: "Please switch to Ethereum Mainnet or Polygon",
          variant: "destructive",
        });
      }
    };

    // Optimized connection check with timeout
    const checkConnection = () => {
      setInitialLoading(true);
      
      const connectionTimeout = setTimeout(() => {
        setInitialLoading(false);
      }, 3000); // Failsafe timeout to prevent long loading
      
      const performCheck = async () => {
        try {
          const wasConnected = localStorage.getItem('walletConnected') === 'true';
          
          if (wasConnected && typeof window.ethereum !== 'undefined') {
            const provider = new BrowserProvider(window.ethereum);
            try {
              const accounts = await provider.listAccounts();
              
              if (accounts.length > 0) {
                setAccount(accounts[0].address);
                
                // Get current chain ID
                const network = await provider.getNetwork();
                const currentChainId = Number(network.chainId);
                setChainId(currentChainId);
  
                if (!SUPPORTED_CHAIN_IDS.includes(currentChainId)) {
                  toast({
                    title: "Unsupported Network",
                    description: "Please switch to Ethereum Mainnet or Polygon",
                    variant: "destructive",
                  });
                }
              } else {
                localStorage.removeItem('walletConnected');
                if (!isPublicRoute && pathname !== '/landing') {
                  router.push('/landing');
                }
              }
            } catch (err) {
              console.log('Provider account check failed, continuing as guest');
              localStorage.removeItem('walletConnected');
            }
          } else if (!isPublicRoute && pathname !== '/landing') {
            router.push('/landing');
          }
        } catch (error) {
          console.error('Error checking connection', error);
        } finally {
          clearTimeout(connectionTimeout);
          setInitialLoading(false);
        }
      };
  
      // Defer connection check
      setTimeout(performCheck, 500);
    };

    // Check connection only on protected routes to improve performance
    if (!isPublicRoute) {
      checkConnection();
    } else {
      setInitialLoading(false);
    }

    // Setup listeners only if necessary
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [pathname, router, isPublicRoute, toast]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error('No ethereum wallet found');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      localStorage.setItem('walletConnected', 'true');
      
      // Get the current chain ID
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
      
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to MetaMask
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: targetChainId === 1 ? 'Ethereum Mainnet' : 'Polygon Mainnet',
                nativeCurrency: {
                  name: targetChainId === 1 ? 'ETH' : 'MATIC',
                  symbol: targetChainId === 1 ? 'ETH' : 'MATIC',
                  decimals: 18,
                },
                rpcUrls: [
                  targetChainId === 1 
                    ? 'https://eth-mainnet.g.alchemy.com/v2/your-api-key'
                    : 'https://polygon-rpc.com'
                ],
                blockExplorerUrls: [
                  targetChainId === 1 
                    ? 'https://etherscan.io'
                    : 'https://polygonscan.com'
                ],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast({
            title: "Network Error",
            description: "Failed to add network to MetaMask",
            variant: "destructive",
          });
        }
      } else {
        console.error('Error switching network:', error);
        toast({
          title: "Network Error",
          description: "Failed to switch network",
          variant: "destructive",
        });
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    localStorage.removeItem('walletConnected');
    router.push('/landing');
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected your wallet",
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <LoadingAnimation message="Initializing" />
        </Suspense>
      </div>
    );
  }

  return (
    <Web3Context.Provider value={{ 
      account, 
      chainId,
      connectWallet, 
      disconnectWallet, 
      isConnecting,
      switchNetwork,
      isBrowserSupported,
      isWalletInstalled,
    }}>
      {children}
    </Web3Context.Provider>
  );
}