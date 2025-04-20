"use client"

import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/components/providers/web3-provider";
import { Loader2, AlertCircle } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import Link from "next/link";

export function WalletConnect() {
  const { 
    account, 
    chainId, 
    connectWallet, 
    disconnectWallet, 
    isConnecting,
    isBrowserSupported,
    isWalletInstalled
  } = useWeb3();

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1:
        return "Ethereum";
      case 137:
        return "Polygon";
      default:
        return "Unsupported Network";
    }
  };

  if (!isBrowserSupported) {
    return (
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <Button
          variant="outline"
          className="text-destructive"
          onClick={() => window.open('https://www.google.com/chrome', '_blank')}
        >
          Please Use Chrome/Firefox
        </Button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <Button disabled variant="outline" className="w-[200px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {getNetworkName(chainId)}
        </div>
        <Button
          variant="outline"
          className="w-[200px]"
          onClick={disconnectWallet}
        >
          {truncateAddress(account)}
        </Button>
      </div>
    );
  }

  if (!isWalletInstalled) {
    return (
      <Button
        variant="outline"
        className="w-[200px]"
        onClick={() => window.open('https://metamask.io/download/', '_blank')}
      >
        Install Wallet
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-[200px]"
      onClick={connectWallet}
    >
      Connect Wallet
    </Button>
  );
}