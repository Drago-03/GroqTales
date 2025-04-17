"use client"

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, connect } = useWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant={address ? "outline" : "default"}
      className="flex items-center"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : address ? (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}