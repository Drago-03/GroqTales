"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, ChevronDown, Copy, ExternalLink, Coins } from "lucide-react";
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

export function WalletConnect() {
  const { account, connected, connecting, balance, networkName, ensName, disconnectWallet, connectWallet } = useWeb3();
  const { toast } = useToast();
  const [showDropdown, setShowDropdown] = useState(false);

  const truncateAddress = (address: string) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyAddressToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const viewOnExplorer = () => {
    if (account) {
      // Default to Ethereum explorer
      let explorerUrl = `https://etherscan.io/address/${account}`;
      
      window.open(explorerUrl, '_blank');
    }
  };

  if (!account || !connected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          onClick={handleConnect} 
          className="bg-[#2C5FF6] hover:bg-[#1D4ED8] text-white flex items-center gap-2"
          disabled={connecting}
        >
          {connecting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Image 
                src="/coinbase-wallet-logo.svg" 
                alt="Coinbase Wallet" 
                width={20} 
                height={20} 
                className="mr-1"
              />
              Connect Wallet
            </>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2"
    >
      <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <div 
                  role="button"
                  tabIndex={0}
                  className="border border-[#2C5FF6]/20 bg-[#2C5FF6]/10 hover:bg-[#2C5FF6]/20 text-[#2C5FF6] px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShowDropdown(!showDropdown);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/coinbase-wallet-logo.svg" 
                      alt="Coinbase Wallet" 
                      width={20} 
                      height={20} 
                    />
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-medium">
                        {ensName || truncateAddress(account)}
                      </span>
                      <span className="text-[10px] text-[#2C5FF6]/80">{networkName}</span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Wallet Connected</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-[#2C5FF6]/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account}`} />
                <AvatarFallback>{account?.substring(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {ensName || truncateAddress(account)}
                </span>
                <span className="text-xs text-muted-foreground">{networkName}</span>
              </div>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Balance</span>
              <div className="flex items-center">
                <Coins className="h-3 w-3 mr-1 text-[#2C5FF6]" />
                <span className="font-medium">{balance || "0.00"} ETH</span>
              </div>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={copyAddressToClipboard} className="cursor-pointer">
            <Copy className="h-4 w-4 mr-2" />
            <span>Copy Address</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={viewOnExplorer} className="cursor-pointer">
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>View on Explorer</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={disconnectWallet}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <Wallet className="h-4 w-4 mr-2" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}