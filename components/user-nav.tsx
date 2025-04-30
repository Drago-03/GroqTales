"use client";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuGroup 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Wallet, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";

export function UserNav() {
  const { account, connectWallet, disconnectWallet } = useWeb3();
  const { toast } = useToast();

  // Truncate wallet address for display
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {account ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/profile" legacyBehavior passHref>
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/my-stories" legacyBehavior passHref>
                  <span>My Stories</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/nft-gallery" legacyBehavior passHref>
                  <span>My NFTs</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnectWallet}>
              <span>Disconnect Wallet</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Wallet: {truncateAddress(account)}</DropdownMenuLabel>
          </>
        ) : (
          <DropdownMenuItem onClick={handleConnect}>
            <span>Connect Wallet</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}