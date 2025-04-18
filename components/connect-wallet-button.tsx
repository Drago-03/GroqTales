"use client";

import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { Loader2, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ConnectWalletButton() {
  const { address, isConnected, isSigningIn, connect, signIn, connectors } = useWeb3Auth();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      if (!isConnected) {
        // Get the first available connector (usually injected - MetaMask)
        const connector = connectors[0];
        if (!connector) {
          throw new Error("No wallet connector found");
        }
        await connect({ connector });
      } else {
        await signIn();
        toast({
          title: "Successfully signed in",
          description: "You can now create and interact with stories",
        });
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
      });
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isSigningIn}
      variant={address ? "outline" : "default"}
      className="flex items-center"
    >
      {isSigningIn ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
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