"use client"

import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { Wallet } from "lucide-react";

export function WalletConnect() {
  const { account, connectWallet, disconnectWallet } = useWeb3();
  const { toast } = useToast();

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

  if (!account) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleConnect} 
        className="hover:theme-gradient-bg hover:text-white hover:border-transparent transition-all duration-300"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={disconnectWallet} 
      className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all duration-300"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {truncateAddress(account)}
    </Button>
  );
}