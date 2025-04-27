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
  connectWallet: (walletType?: string) => Promise<void>;
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
const MONAD_CHAIN_ID = 10143; // 0x279f
const MONAD_RPC_URL = 'https://testnet-rpc.monad.xyz';
const MONAD_EXPLORER_URL = 'https://explorer.monad.xyz'; // Placeholder, replace with actual explorer URL if available

// Update SUPPORTED_CHAIN_IDS to include Monad
const SUPPORTED_CHAIN_IDS = [1, 137, MONAD_CHAIN_ID];
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

  const connectWallet = async (walletType?: string) => {
    if (!window.ethereum && !walletType) {
      console.error('No ethereum wallet found');
      toast({
        title: "Wallet Not Found",
        description: "No Ethereum wallet detected. Please install MetaMask or another compatible wallet extension.",
        variant: "destructive",
      });
      return;
    }

    console.log('Attempting to connect wallet...', walletType || 'default');
    setIsConnecting(true);
    try {
      let provider;
      if (walletType === 'metamask' || !walletType) {
        if (window.ethereum && window.ethereum.isMetaMask) {
          console.log('MetaMask detected');
          toast({
            title: "MetaMask Detected",
            description: "MetaMask extension found. Attempting to connect...",
            variant: "default",
          });
          provider = new BrowserProvider(window.ethereum as any);
        } else {
          toast({
            title: "MetaMask Not Found",
            description: "MetaMask is not installed. Please install MetaMask to connect.",
            variant: "destructive",
          });
          throw new Error('MetaMask not detected');
        }
      } else if (walletType === 'walletconnect') {
        // Placeholder for WalletConnect integration using web3modal
        console.log('WalletConnect selected');
        toast({
          title: "WalletConnect Selected",
          description: "Please scan the QR code with your mobile wallet. (Integration coming soon)",
          variant: "default",
        });
        // In a real implementation, web3modal would handle this
        throw new Error('WalletConnect integration not implemented yet');
      } else if (walletType === 'ledger') {
        // Placeholder for Ledger integration
        console.log('Ledger wallet selected');
        toast({
          title: "Ledger Wallet Selected",
          description: "Please connect your Ledger device. (Integration coming soon)",
          variant: "default",
        });
        // In a real implementation, web3modal or a specific library would handle this
        throw new Error('Ledger integration not implemented yet');
      } else {
        console.log('Default wallet connection');
        toast({
          title: "Default Wallet Connection",
          description: "Attempting to connect with the default wallet provider...",
          variant: "default",
        });
        provider = new BrowserProvider(window.ethereum as any);
      }

      console.log('Requesting accounts from wallet...');
      toast({
        title: "Requesting Access",
        description: "Please approve the connection request in your wallet.",
        variant: "default",
      });
      const accounts = await provider.send('eth_requestAccounts', []);
      console.log('Accounts received:', accounts);
      setAccount(accounts[0]);
      localStorage.setItem('walletConnected', 'true');
      
      // Get the current chain ID
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);
      
      // Bypass for Monad maintenance - always show Monad as active on frontend
      if (currentChainId !== MONAD_CHAIN_ID) {
        toast({
          title: "Network Notice",
          description: "Monad network is under maintenance. Operations will be simulated on Monad Testnet.",
          variant: "default",
        });
        setChainId(MONAD_CHAIN_ID); // Simulate Monad on frontend
      }
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet.",
        variant: "default",
      });
      
      return accounts[0];
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      let errorMessage = 'Unknown error';
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request.';
      } else if (error.code === -32002) {
        errorMessage = 'Request already pending. Please check MetaMask.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Connection Error",
        description: `Failed to connect: ${errorMessage}. Please try again or check your wallet settings.`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsConnecting(false);
      console.log('Connection attempt completed');
    }
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;

    if (targetChainId === MONAD_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${MONAD_CHAIN_ID.toString(16)}`,
            chainName: 'Monad Testnet',
            rpcUrls: [MONAD_RPC_URL],
            blockExplorerUrls: [MONAD_EXPLORER_URL],
            nativeCurrency: {
              name: 'Monad',
              symbol: 'MONAD',
              decimals: 18
            }
          }]
        });
        setChainId(targetChainId);
        toast({
          title: "Network Switched",
          description: "Successfully switched to Monad Testnet"
        });
      } catch (error) {
        console.error('Failed to switch to Monad network:', error);
        toast({
          title: "Network Switch Failed",
          description: "Could not switch to Monad Testnet",
          variant: "destructive"
        });
      }
      return;
    }

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