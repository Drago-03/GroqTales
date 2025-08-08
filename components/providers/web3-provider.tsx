'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock Web3 Provider for production deployment
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
  }>;
  mintNFTOnMonad: (metadata: any, recipient?: string) => Promise<{
    tokenId: string;
    transactionHash: string;
  }>;
  transferNFT: (tokenId: string, to: string) => Promise<string>;
  getUserNFTs: () => Promise<any[]>;
  getMarketplaceNFTs: () => Promise<any[]>;
  sellNFT: (tokenId: string, price: string) => Promise<void>;
  buyNFT: (tokenId: string, price: string) => Promise<void>;
  cancelListing: (tokenId: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Fallback (no-op) implementation used during static generation / SSR when the
// provider tree isn't mounted (e.g. export builds on platforms that prerender
// pages without executing RootLayout providers). This prevents build-time
// crashes like: "TypeError: Cannot read properties of null (reading 'useContext')".
// All methods either resolve immediately or throw a clear disabled message.
const fallbackWeb3Context: Web3ContextType = {
  account: null,
  chainId: null,
  balance: null,
  connected: false,
  connecting: false,
  networkName: 'Unknown',
  ensName: null,
  connectWallet: async () => {
    /* no-op during SSR */
  },
  disconnectWallet: () => {
    /* no-op */
  },
  switchNetwork: async () => {
    /* no-op */
  },
  mintNFTOnBase: async () => {
    throw new Error('Web3 functionality unavailable during prerender');
  },
  mintNFTOnMonad: async () => {
    throw new Error('Web3 functionality unavailable during prerender');
  },
  transferNFT: async () => {
    throw new Error('Web3 functionality unavailable during prerender');
  },
  getUserNFTs: async () => [],
  getMarketplaceNFTs: async () => [],
  sellNFT: async () => {
    throw new Error('Web3 functionality unavailable during prerender');
  },
  buyNFT: async () => {
    throw new Error('Web3 functionality unavailable during prerender');
  },
  cancelListing: async () => {
    throw new Error('Web3 functionality unavailable during prerender');
  },
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [networkName, setNetworkName] = useState('Unknown');
  const [ensName, setEnsName] = useState<string | null>(null);

  const connectWallet = async () => {
    console.log('Mock connectWallet - Web3 functionality disabled');
    // Mock connection for development
    setConnecting(true);
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccount('0x1234...5678');
      setChainId(1);
      setBalance('1.5');
      setConnected(true);
      setNetworkName('Ethereum Mainnet');
    } catch (error) {
      console.error('Mock wallet connection failed:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    console.log('Mock disconnectWallet - Web3 functionality disabled');
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setConnected(false);
    setNetworkName('Unknown');
    setEnsName(null);
  };

  const switchNetwork = async (targetChainId: number) => {
    console.log('Mock switchNetwork - Web3 functionality disabled');
    setChainId(targetChainId);
  };

  const mintNFTOnBase = async (metadata: any, recipient?: string) => {
    console.log('Mock mintNFTOnBase - Web3 functionality disabled');
    throw new Error('Web3 functionality is disabled in this build');
  };

  const mintNFTOnMonad = async (metadata: any, recipient?: string) => {
    console.log('Mock mintNFTOnMonad - Web3 functionality disabled');
    throw new Error('Web3 functionality is disabled in this build');
  };

  const transferNFT = async (tokenId: string, to: string) => {
    console.log('Mock transferNFT - Web3 functionality disabled');
    throw new Error('Web3 functionality is disabled in this build');
  };

  const getUserNFTs = async () => {
    console.log('Mock getUserNFTs - Web3 functionality disabled');
    return [];
  };

  const getMarketplaceNFTs = async () => {
    console.log('Mock getMarketplaceNFTs - Web3 functionality disabled');
    return [];
  };

  const sellNFT = async (tokenId: string, price: string) => {
    console.log('Mock sellNFT - Web3 functionality disabled');
    throw new Error('Web3 functionality is disabled in this build');
  };

  const buyNFT = async (tokenId: string, price: string) => {
    console.log('Mock buyNFT - Web3 functionality disabled');
    throw new Error('Web3 functionality is disabled in this build');
  };

  const cancelListing = async (tokenId: string) => {
    console.log('Mock cancelListing - Web3 functionality disabled');
    throw new Error('Web3 functionality is disabled in this build');
  };

  const contextValue: Web3ContextType = {
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
    mintNFTOnMonad,
    transferNFT,
    getUserNFTs,
    getMarketplaceNFTs,
    sellNFT,
    buyNFT,
    cancelListing,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  // Return a safe fallback instead of throwing to keep build / prerender alive.
  return context ?? fallbackWeb3Context;
}