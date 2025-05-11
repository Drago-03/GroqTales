"use client";

import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export function WalletBalance() {
  const { address, isConnected } = useWeb3Auth();

  if (!isConnected || !address) {
    return null;
  }

  // Placeholder balance - replace with actual API call in future
  const mockBalance = "0.00 ETH";

  return (
    <Card className="nft-pulse w-full max-w-xs mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-4 w-4" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-center">{mockBalance}</p>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Connected: {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
      </CardContent>
    </Card>
  );
} 