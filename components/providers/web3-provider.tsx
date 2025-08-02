"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

// Types for Web3 context
interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  balance: string;
  connected: boolean;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  networkName: string | null;
  ensName: string | null;
  switchNetwork: (chainId: number) => Promise<void>;
  mintNFTOnBase: (metadata: any) => Promise<any>;
  buyNFTOnBase: (tokenId: string, price: string) => Promise<any>;
  sellNFTOnBase: (tokenId: string, price: string) => Promise<any>;
  getNFTListings: () => Promise<any[]>;
}

// Create context
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Provider component
export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0.0000");
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Network configurations
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    137: "Polygon",
    8453: "Base",
    42161: "Arbitrum One",
    10: "Optimism",
  };

  const connectWallet = async () => {
    if (connecting) return;
    
    setConnecting(true);
    
    try {
      if (!window.ethereum) {
        toast({
          title: "Wallet Not Found",
          description: "Please install MetaMask or another Web3 wallet",
          variant: "destructive",
        });
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        setConnected(true);
        localStorage.setItem("walletConnected", "true");

        // Get chain ID
        const chainIdHex = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chainIdNum = parseInt(chainIdHex, 16);
        setChainId(chainIdNum);
        setNetworkName(networks[chainIdNum] || "Unknown Network");

        // Get balance
        const balanceHex = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        const balanceWei = parseInt(balanceHex, 16);
        const balanceEth = (balanceWei / 1e18).toFixed(4);
        setBalance(balanceEth);

        // Check for ENS name on Ethereum mainnet
        let name = null;
        if (chainIdNum === 1) {
          try {
            // This is a mock for demonstration - in production you'd use an actual ENS lookup
            if (accounts[0].toLowerCase().includes("0x")) {
              name = null;
            }
          } catch (error) {
            console.error("ENS lookup failed:", error);
          }
        }
        setEnsName(name);

        toast({
          title: "Wallet Connected",
          description: `Connected to ${account.slice(0, 6)}...${account.slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setBalance("0.0000");
    setConnected(false);
    setNetworkName(null);
    setEnsName(null);
    localStorage.removeItem("walletConnected");
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      console.error("Network switch error:", error);
      toast({
        title: "Network Switch Failed",
        description: error.message || "Failed to switch network",
        variant: "destructive",
      });
    }
  };

  const mintNFTOnBase = async (metadata: any) => {
    try {
      // Mock NFT minting implementation
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "NFT Minted Successfully",
        description: `Transaction: ${mockTxHash.slice(0, 10)}...`,
      });
      
      return {
        success: true,
        transactionHash: mockTxHash,
        tokenId: Math.floor(Math.random() * 10000).toString(),
      };
    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
      throw error;
    }
  };

  const buyNFTOnBase = async (tokenId: string, price: string) => {
    try {
      // Mock NFT buying implementation
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "NFT Purchased Successfully",
        description: `Bought NFT #${tokenId} for ${price} ETH`,
      });
      
      return {
        success: true,
        transactionHash: mockTxHash,
        tokenId,
        price,
      };
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to buy NFT",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sellNFTOnBase = async (tokenId: string, price: string) => {
    try {
      // Mock NFT selling implementation
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "NFT Listed for Sale",
        description: `Listed NFT #${tokenId} for ${price} ETH`,
      });
      
      return {
        success: true,
        transactionHash: mockTxHash,
        tokenId,
        price,
      };
    } catch (error: any) {
      toast({
        title: "Listing Failed",
        description: error.message || "Failed to list NFT",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getNFTListings = async () => {
    try {
      // Mock NFT listings data
      const mockNFTs: any[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        tokenId: `0x${Math.floor(Math.random() * 1000000).toString(16)}`,
        title: `NFT #${i + 1}`,
        description: `This is a mock NFT #${i + 1}`,
        price: `${(Math.random() * 2 + 0.1).toFixed(3)} ETH`,
        seller: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        owner: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        image: `https://picsum.photos/seed/${i}/400/400`,
        status: Math.random() > 0.3 ? 'listed' : (Math.random() > 0.5 ? 'unlisted' : 'sold'),
        metadata: {
          attributes: [
            { trait_type: "Type", value: Math.random() > 0.5 ? "Comic" : "Text" },
            { trait_type: "Rarity", value: ["Common", "Uncommon", "Rare", "Legendary"][Math.floor(Math.random() * 4)] }
          ]
        }
      }));

      return mockNFTs;
    } catch (error: any) {
      toast({
        title: "Failed to Load NFTs",
        description: error.message || "Failed to fetch NFT listings",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && localStorage.getItem("walletConnected") === "true") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts && accounts.length > 0) {
            connectWallet();
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Set up event listeners for wallet events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [account]);

  // Mock data for demo purposes
  useEffect(() => {
    if (!window.ethereum && !connected) {
      const timer = setTimeout(() => {
        const mockAccount = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
        setAccount(mockAccount);
        setChainId(1);
        setBalance("2.5432");
        setConnected(true);
        setEnsName("groq.eth");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [connected]);

  const value = {
    account,
    chainId,
    balance,
    connected,
    connecting,
    connectWallet,
    disconnectWallet,
    networkName,
    ensName,
    switchNetwork,
    mintNFTOnBase,
    buyNFTOnBase,
    sellNFTOnBase,
    getNFTListings,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
