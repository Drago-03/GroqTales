"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Import Coinbase AgentKit and related modules
// Removed problematic import for OnchainKit due to linter errors
import { base } from "viem/chains";
import { uploadToIPFS, getIPFSUrl } from '@/utils/ipfs';

// Import Coinbase Wallet SDK
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

// Constants for Monad (placeholder values)
/*
const MONAD_CHAIN_ID = "0x1"; // Replace with actual Monad chain ID
const MONAD_RPC_URL = "https://monad-rpc-url.com"; // Replace with actual Monad RPC URL
*/

// Constants for Base network
const BASE_CHAIN_ID = base.id;
const BASE_RPC_URL = process.env.NEXT_PUBLIC_COINBASE_MAINNET_RPC_ENDPOINT || "https://mainnet.base.org";

// Initialize Coinbase Wallet SDK with environment variables
const sdk = new CoinbaseWalletSDK({
  appName: "GroqTales",
  appChainIds: [BASE_CHAIN_ID]
});

// Make web3 provider
const coinbaseProvider = sdk.makeWeb3Provider();

// Types
interface NFT {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  price: string;
  seller: string;
  owner: string;
  image: string;
  metadata: any;
  status: 'listed' | 'unlisted' | 'sold';
}

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  connected: boolean;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  networkName: string;
  ensName: string | null;
  switchNetwork: (chainId: number) => Promise<void>;
  mintNFTOnBase: (metadata: any, recipient?: string) => Promise<{
    tokenId: string;
    transactionHash: string;
    metadata: {
      content: string;
      [key: string]: any;
    };
  }>;
  buyNFTOnBase: (tokenId: string, price: string) => Promise<{ transactionHash: string; tokenId: string }>;
  sellNFTOnBase: (tokenId: string, price: string) => Promise<{ transactionHash: string }>;
  getNFTListings: () => Promise<NFT[]>;
}

// Create context with default values
const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  balance: null,
  connected: false,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  networkName: "",
  ensName: null,
  switchNetwork: async () => {},
  mintNFTOnBase: async () => ({
    tokenId: "",
    transactionHash: "",
    metadata: { content: "" }
  }),
  buyNFTOnBase: async () => ({ transactionHash: "", tokenId: "" }),
  sellNFTOnBase: async () => ({ transactionHash: "" }),
  getNFTListings: async () => [],
});

// Networks mapping
const NETWORKS: Record<number, string> = {
  1: "Ethereum",
  137: "Polygon",
  56: "BNB Chain",
  42161: "Arbitrum",
  10: "Optimism",
  43114: "Avalanche",
};

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [ensName, setEnsName] = useState<string | null>(null);

  // Get the network name based on chainId
  const networkName = chainId && NETWORKS[chainId] ? NETWORKS[chainId] : "Unknown Network";

  // Function to connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "No Wallet Found",
        description: "Please install MetaMask or another Web3 wallet to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setConnecting(true);
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainIdNum = parseInt(chainIdHex, 16);
      
      if (accounts && accounts[0]) {
        // Get account balance
        const balanceHex = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });
        
        const balanceWei = parseInt(balanceHex, 16);
        const balanceEth = (balanceWei / 1e18).toFixed(4);
        
        // Check for ENS name on Ethereum mainnet
        let name = null;
        if (chainIdNum === 1) {
          try {
            // This is a mock for demonstration - in production you'd use an actual ENS lookup
            if (accounts[0].toLowerCase().includes("0x")) {
              name = `${accounts[0].substring(2, 6)}...${accounts[0].substring(38)}.eth`;
            }
          } catch (error) {
            console.error("Error fetching ENS name:", error);
          }
        }
        
        setAccount(accounts[0]);
        setChainId(chainIdNum);
        setBalance(balanceEth);
        setConnected(true);
        setEnsName(name);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${NETWORKS[chainIdNum] || 'network'} as ${name || accounts[0].substring(0, 6) + '...' + accounts[0].substring(38)}`,
        });

        // Store in localStorage for persistence
        localStorage.setItem("walletConnected", "true");
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      console.error("Error connecting wallet:", error);
    } finally {
      setConnecting(false);
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setConnected(false);
    setEnsName(null);
    localStorage.removeItem("walletConnected");
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Function to switch networks
  const switchNetwork = async (newChainId: number) => {
    if (!window.ethereum) return;
    
    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${newChainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network is not added to MetaMask, we would need to add it
      if (switchError.code === 4902) {
        toast({
          title: "Network Not Available",
          description: "This network needs to be added to your wallet",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Network Switch Failed",
          description: switchError.message || "Failed to switch network",
          variant: "destructive",
        });
      }
    }
  };

  // Add mintNFTOnBase function
  const mintNFTOnBase = async (metadata: any, recipient?: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    if (chainId !== BASE_CHAIN_ID) {
      await switchNetwork(BASE_CHAIN_ID);
    }

    try {
      // Upload metadata to IPFS
      const ipfsHash = await uploadToIPFS(metadata);
      const tokenURI = getIPFSUrl(ipfsHash);

      // Mock minting for now - in production, this would interact with your smart contract
      const mockTokenId = `0x${Math.floor(Math.random() * 1000000).toString(16)}`;
      const mockTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      toast({
        title: "NFT Minted Successfully",
        description: `Your NFT has been minted on Base with token ID ${mockTokenId}`,
      });

      return {
        tokenId: mockTokenId,
        transactionHash: mockTxHash,
        metadata: {
          ...metadata,
          content: metadata.content || metadata.description || "",
        }
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

  // Add buyNFTOnBase function
  const buyNFTOnBase = async (tokenId: string, price: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    if (chainId !== BASE_CHAIN_ID) {
      await switchNetwork(BASE_CHAIN_ID);
    }

    try {
      // Mock buying for now - in production, this would interact with your smart contract
      const mockTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      toast({
        title: "NFT Purchased Successfully",
        description: `You have purchased NFT #${tokenId} for ${price}`,
      });

      return { transactionHash: mockTxHash, tokenId };
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase NFT",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add sellNFTOnBase function
  const sellNFTOnBase = async (tokenId: string, price: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    if (chainId !== BASE_CHAIN_ID) {
      await switchNetwork(BASE_CHAIN_ID);
    }

    try {
      // Mock selling for now - in production, this would interact with your smart contract
      const mockTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      toast({
        title: "NFT Listed Successfully",
        description: `Your NFT #${tokenId} has been listed for ${price}`,
      });

      return { transactionHash: mockTxHash };
    } catch (error: any) {
      toast({
        title: "Listing Failed",
        description: error.message || "Failed to list NFT",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add getNFTListings function
  const getNFTListings = async () => {
    try {
      // Mock NFT listings for now - in production, this would fetch from your smart contract
      const mockNFTs: NFT[] = Array.from({ length: 10 }, (_, i) => ({
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
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        // User switched accounts
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // When chain changes, we need to reload the page to get fresh state
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
    // If no real wallet is connected, use mock data after a delay
    if (!window.ethereum && !connected) {
      const timer = setTimeout(() => {
        const mockAccount = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
        setAccount(mockAccount);
        setChainId(1); // Ethereum Mainnet
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

export const useWeb3 = () => useContext(Web3Context);

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
    };
  }
}