"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Import Coinbase OnchainKit and related modules
// Removed problematic import for OnchainKit due to linter errors
import { base } from "viem/chains";

// Constants for Monad (placeholder values)
const MONAD_CHAIN_ID = "0x1"; // Replace with actual Monad chain ID
const MONAD_RPC_URL = "https://monad-rpc-url.com"; // Replace with actual Monad RPC URL

// Constants for Base network
const BASE_CHAIN_ID = base.id;
const BASE_RPC_URL = "https://mainnet.base.org";

interface Web3ContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBaseNetwork: () => Promise<boolean>;
  switchToMonadNetwork: () => Promise<boolean>;
  // NFT functions for Monad
  mintNFTOnMonad: (storyId: string, recipient: string) => Promise<{ tokenId: string; transactionHash: string }>;
  // NFT functions for Base
  mintNFTOnBase: (storyId: string, recipient: string) => Promise<{ tokenId: string; transactionHash: string }>;
  buyNFTOnBase: (tokenId: string, buyer: string) => Promise<{ tokenId: string; transactionHash: string }>;
  sellNFTOnBase: (tokenId: string, seller: string, price: string) => Promise<{ tokenId: string; transactionHash: string }>;
  getNFTListings: () => Promise<any[]>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const { toast } = useToast();

  // Placeholder for Coinbase OnchainKit initialization
  // Will be implemented once linter issues are resolved or proper documentation is available
  // const onchainKit = useOnchainKit({ chainId: BASE_CHAIN_ID, rpcUrl: BASE_RPC_URL });

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }

        window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
          setAccount(newAccounts[0] || null);
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      } else {
        console.error("No Ethereum provider found. Please install MetaMask or another wallet.");
        toast({
          title: "No Wallet Found",
          description: "Please install MetaMask or another Ethereum wallet to use this feature.",
          variant: "destructive",
        });
      }
    };

    init();
  }, [toast]);

  const connectWallet = async () => {
    if (!provider) {
      toast({
        title: "No Wallet Provider",
        description: "No Ethereum wallet provider found. Please install MetaMask.",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const switchToBaseNetwork = async (): Promise<boolean> => {
    if (!provider || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: BASE_CHAIN_ID }]);
      toast({
        title: "Network Switched",
        description: "Successfully switched to Base network.",
      });
      return true;
    } catch (error) {
      console.error("Failed to switch to Base network:", error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Base network. Please try manually through your wallet.",
        variant: "destructive",
      });
      return false;
    }
  };

  const switchToMonadNetwork = async (): Promise<boolean> => {
    if (!provider || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: MONAD_CHAIN_ID }]);
      toast({
        title: "Network Switched",
        description: "Successfully switched to Monad network.",
      });
      return true;
    } catch (error) {
      console.error("Failed to switch to Monad network:", error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Monad network. Please try manually through your wallet.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Placeholder for Monad NFT minting
  const mintNFTOnMonad = async (storyId: string, recipient: string) => {
    if (!provider || !account) {
      throw new Error("Wallet not connected");
    }
    // Implementation for minting on Monad network
    console.log(`Minting NFT for story ${storyId} to ${recipient} on Monad`);
    // Return dummy data for now
    return { tokenId: `monad-${storyId}`, transactionHash: "0x..." };
  };

  // NFT functions for Base using Coinbase OnchainKit (placeholders for now)
  const mintNFTOnBase = async (storyId: string, recipient: string) => {
    if (!provider || !account) {
      throw new Error("Wallet not connected");
    }
    try {
      // Placeholder for OnchainKit minting on Base network
      console.log(`Minting NFT for story ${storyId} to ${recipient} on Base`);
      // Return dummy data for now
      return { tokenId: `base-${storyId}`, transactionHash: "0x..." };
    } catch (error) {
      console.error("Failed to mint NFT on Base:", error);
      throw new Error("Failed to mint NFT on Base");
    }
  };

  const buyNFTOnBase = async (tokenId: string, buyer: string) => {
    if (!provider || !account) {
      throw new Error("Wallet not connected");
    }
    try {
      // Placeholder for OnchainKit buying on Base network
      console.log(`Buying NFT ${tokenId} for ${buyer} on Base`);
      // Return dummy data for now
      return { tokenId, transactionHash: "0x..." };
    } catch (error) {
      console.error("Failed to buy NFT on Base:", error);
      throw new Error("Failed to buy NFT on Base");
    }
  };

  const sellNFTOnBase = async (tokenId: string, seller: string, price: string) => {
    if (!provider || !account) {
      throw new Error("Wallet not connected");
    }
    try {
      // Placeholder for OnchainKit selling on Base network
      console.log(`Selling NFT ${tokenId} by ${seller} for ${price} on Base`);
      // Return dummy data for now
      return { tokenId, transactionHash: "0x..." };
    } catch (error) {
      console.error("Failed to sell NFT on Base:", error);
      throw new Error("Failed to sell NFT on Base");
    }
  };

  const getNFTListings = async () => {
    try {
      // Placeholder for fetching NFT listings
      console.log("Fetching NFT listings");
      // Return dummy data for now
      return [
        { tokenId: "base-1", title: "Story NFT 1", price: "0.01", seller: "0xSeller1", status: "listed", description: "A unique story NFT", coverImage: "/covers/story1.jpg", genre: "Fantasy", author: "Author1", likes: 10, views: 100 },
        { tokenId: "base-2", title: "Story NFT 2", price: "0.02", seller: "0xSeller2", status: "listed", description: "Another unique story NFT", coverImage: "/covers/story2.jpg", genre: "Sci-Fi", author: "Author2", likes: 15, views: 150 },
        { tokenId: "base-3", title: "Story NFT 3", price: "0.015", seller: "0xSeller3", status: "listed", description: "Yet another unique story NFT", coverImage: "/covers/story3.jpg", genre: "Mystery", author: "Author3", likes: 8, views: 80 },
        { tokenId: "base-4", title: "Story NFT 4", price: "0.025", seller: "0xSeller4", status: "listed", description: "A captivating story NFT", coverImage: "/covers/story4.jpg", genre: "Romance", author: "Author4", likes: 20, views: 200 },
        { tokenId: "base-5", title: "Story NFT 5", price: "0.03", seller: "0xSeller5", status: "listed", description: "An intriguing story NFT", coverImage: "/covers/story5.jpg", genre: "Adventure", author: "Author5", likes: 12, views: 120 },
      ];
    } catch (error) {
      console.error("Failed to fetch NFT listings:", error);
      throw new Error("Failed to fetch NFT listings");
    }
  };

  const value: Web3ContextType = {
    account,
    connectWallet,
    disconnectWallet,
    switchToBaseNetwork,
    switchToMonadNetwork,
    mintNFTOnMonad,
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
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};