"use client";

import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function NFTPurchase({ nftId, nftTitle, price }: { nftId: string, nftTitle: string, price: string }) {
  const { address, isConnected } = useWeb3Auth();

  if (!isConnected || !address) {
    return (
      <Card className="nft-pulse w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg doodle-heading">
            <Sparkles className="h-4 w-4" />
            Purchase {nftTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Connect wallet to purchase this NFT</p>
        </CardContent>
      </Card>
    );
  }

  // Placeholder purchase action
  const handlePurchase = () => {
    alert(`Purchased ${nftTitle} for ${price} ETH! (This is a mock action)`);
  };

  return (
    <Card className="nft-pulse w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg doodle-heading">
          <Sparkles className="h-4 w-4" />
          Purchase {nftTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p className="text-xl font-bold">Price: {price} ETH</p>
        <Button className="nft-button" onClick={handlePurchase}>
          Buy Now
        </Button>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Connected: {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
      </CardContent>
    </Card>
  );
} 