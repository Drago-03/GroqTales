"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingAnimation } from "@/components/loading-animation";
import { useToast } from "@/components/ui/use-toast";

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  switchNetwork: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

const SUPPORTED_CHAIN_IDS = [1, 137]; // Ethereum Mainnet and Polygon
const DEFAULT_CHAIN_ID = 1;

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Public routes that don't require authentication
  const publicRoutes = ['/landing', '/community', '/explore', '/stories', '/about', '/privacy', '/terms', '/genres', '/nft-gallery'];

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

    const checkConnection = async () => {
      try {
        const wasConnected = localStorage.getItem('walletConnected') === 'true';
        
        if (wasConnected && typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            // Get current chain ID
            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            const currentChainId = parseInt(chainIdHex, 16);
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
        } else if (!isPublicRoute && pathname !== '/landing') {
          router.push('/landing');
        }
      } catch (error) {
        console.error('Error checking connection', error);
        toast({
          title: "Connection Error",
          description: "Failed to check wallet connection",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    // Check initial connection
    checkConnection();

    // Setup listeners
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [pathname, router, isPublicRoute, toast]);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use this feature",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      localStorage.setItem('walletConnected', 'true');

      // Get current chain ID
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainIdHex, 16);
      setChainId(currentChainId);

      if (!SUPPORTED_CHAIN_IDS.includes(currentChainId)) {
        await switchNetwork(DEFAULT_CHAIN_ID);
      }

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet",
        variant: "destructive",
      });
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
        <LoadingAnimation message="Initializing" />
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
    }}>
      {children}
    </Web3Context.Provider>
  );
}