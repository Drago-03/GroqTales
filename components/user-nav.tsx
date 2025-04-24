"use client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Wallet, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useWeb3 } from "@/components/providers/web3-provider";
import { LoadingAnimation } from "@/components/loading-animation";
import { useToast } from "@/components/ui/use-toast";

export function UserNav() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const { toast } = useToast();

  // Truncate wallet address for display
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleConnectWallet = async () => {
    console.log('Connect Wallet button clicked');
    toast({
      title: "Initiating Connection",
      description: "Attempting to connect to your wallet...",
      variant: "default",
    });
    try {
      // Add a small delay to ensure UI updates are rendered before opening MetaMask popup
      await new Promise(resolve => setTimeout(resolve, 100));
      await connectWallet();
      toast({
        title: "Connection Successful",
        description: "MetaMask wallet connected successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please ensure MetaMask or another wallet extension is installed.",
        variant: "destructive",
      });
    }
  };

  // Access control based on wallet ID will be implemented in a separate component or hook
  // to manage user history, generation limit, and minting features for specific wallet IDs.

  if (isConnecting) {
    return (
      <Button variant="outline" size="sm" disabled>
        <LoadingAnimation message="Connecting..." />
      </Button>
    );
  }

  if (!account) {
    return (
      <Button variant="outline" size="sm" onClick={handleConnectWallet} className="hover:theme-gradient-bg hover:text-white hover:border-transparent transition-all duration-300">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/user-default.png" alt="User" />
            <AvatarFallback className="theme-gradient-bg text-white">
              {account.substring(2, 4)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">Wallet Connected</p>
            <p className="text-sm text-muted-foreground">{truncateAddress(account)}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}