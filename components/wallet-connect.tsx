"use client"

import { useState, useCallback } from "react";
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
   * Implements WalletConnect functionality
   * 
   * @function WalletConnect
   * @returns {void|Promise<void>} Function return value
   */


export function WalletConnect() {
  const { connectWallet, disconnectWallet, account, connected, connecting, networkName } = useWeb3();
  const { toast } = useToast();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState("Copy Address");

  const handleConnect = useCallback(async () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  }, [account, connectWallet, disconnectWallet]);

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddressToClipboard = () => {
    if (account && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(account);
      setCopyTooltip("Copied!");
      setTimeout(() => setCopyTooltip("Copy Address"), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard!",
      });
    }
  };

  const viewOnExplorer = () => {
    if (account) {
      // Use appropriate explorer URL based on networkName
      let explorerUrl = `https://etherscan.io/address/${account}`;
      
      // Just examples, can be expanded based on supported chains
      if (networkName === "Polygon") {
        explorerUrl = `https://polygonscan.com/address/${account}`;
      } else if (networkName === "Optimism") {
        explorerUrl = `https://optimistic.etherscan.io/address/${account}`;
      }
      
      window.open(explorerUrl, "_blank");
    }
  };

  // Show loading state
  if (connecting) {
    return (
      <Button 
        disabled
        size="sm" 
        className="gap-2"
      >
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Connecting...
      </Button>
    );
  }

  // Not connected state
  if (!account || !connected) {
    return (
      <Button 
        variant="default" 
        size="sm"
        onClick={handleConnect}
        id="connect-wallet-button"
      >
        Connect Wallet
      </Button>
    );
  }

  // Connected state with dropdown
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* This is a custom non-button element that acts like a button */}
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
              <span>{formatAddress(account)}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connected to {networkName || "Ethereum"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dropdown component separate from trigger */}
      <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
        {/* Hidden trigger to satisfy the component's requirements */}
        <DropdownMenuTrigger className="sr-only" aria-hidden="true">
          Open menu
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
          
          <DropdownMenuItem onClick={disconnectWallet}>
            <div className="text-red-500 flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Disconnect
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}