"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { uploadToIPFS, getIPFSUrl, getIPFSFallbackUrls } from "@/utils/ipfs";
// Import Coinbase AgentKit and related modules
// Removed problematic import for OnchainKit due to linter errors
import { base } from "viem/chains";
// Import Coinbase Wallet SDK
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
// Constants for Monad (placeholder values)
/*
const MONAD_CHAIN_ID = "0x1"; // Replace with actual Monad chain ID
const MONAD_RPC_URL = "https://monad-rpc-url.com"; // Replace with actual Monad RPC URL
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
    ipfsHash: string;
    tokenURI: string;
    fallbackUrls: string[];
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
    metadata: { content: "" },
    ipfsHash: "",
    tokenURI: "",
    fallbackUrls: []
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
              name = null;
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