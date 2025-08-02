"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, ChevronDown, Copy, ExternalLink, Coins, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

/**
 * WalletConnect Component
 * 
 * A comprehensive wallet connection component that provides:
 * - Wallet connection/disconnection functionality
 * - Account display with ENS support
 * - Network information and switching
 * - Balance display
 * - Address copying and blockchain explorer links
 * - Responsive design with tooltips and animations
 * 
 * @returns JSX.Element - The wallet connection component
 */
export default function WalletConnect() {
  const {
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
  } = useWeb3();
  
  const { toast } = useToast();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState("Click to copy");

  /**
   * Formats wallet address for display
   * @param address - The wallet address to format
   * @returns Formatted address string
   */
  const formatAddress = useCallback((address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  /**
   * Copies wallet address to clipboard
   */
  const copyAddressToClipboard = useCallback(async () => {
    if (!account) return;
    
    try {
      await navigator.clipboard.writeText(account);
      setCopyTooltip("Copied!");
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      
      setTimeout(() => setCopyTooltip("Click to copy"), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  }, [account, toast]);

  /**
   * Opens blockchain explorer for the connected account
   */
  const viewOnExplorer = useCallback(() => {
    if (!account || !chainId) return;
    
    const explorerUrls: Record<number, string> = {
      1: "https://etherscan.io",
      137: "https://polygonscan.com",
      8453: "https://basescan.org",
      42161: "https://arbiscan.io",
      10: "https://optimistic.etherscan.io",
    };
    
    const explorerUrl = explorerUrls[chainId] || "https://etherscan.io";
    window.open(`${explorerUrl}/address/${account}`, "_blank");
  }, [account, chainId]);

  // Show connect button if not connected
  if (!connected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={connecting}
        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {connecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </Button>
    );
  }

  // Show connected wallet interface
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowDropdown(!showDropdown)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowDropdown(!showDropdown);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-haspopup="true"
              aria-expanded={showDropdown ? "true" : "false"}
            >
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>{ensName || formatAddress(account)}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connected to {networkName || "Ethereum"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dropdown Menu */}
      <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
        <DropdownMenuTrigger className="sr-only" aria-hidden="true">
          Open menu
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* Account Info */}
          <div className="px-3 py-2 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account}`} />
                <AvatarFallback>{account?.slice(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {ensName || formatAddress(account)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {balance} ETH
                </p>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="px-3 py-2 border-b">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Network</span>
              <span className="text-xs font-medium">{networkName || "Ethereum"}</span>
            </div>
          </div>

          {/* Actions */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuItem onClick={copyAddressToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copyTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={disconnectWallet}>
            <div className="text-red-500 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Disconnect
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}