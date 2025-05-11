"use client";

import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { Loader2, Wallet, QrCode, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

export function ConnectWalletButton() {
  const { address, isConnected, isSigningIn, connect, signIn, connectors } = useWeb3Auth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [availableConnectors, setAvailableConnectors] = useState<Record<string, { index: number, name: string, id: string }>>({});

  // Detect available connectors on component mount and when connectors change
  useEffect(() => {
    if (connectors.length > 0) {
      console.log("Available connectors:", connectors.map(c => ({ id: c.id, name: c.name })));
      const detectedConnectors: Record<string, { index: number, name: string, id: string }> = {};
      
      // Look for MetaMask or injected providers
      const metaMaskIdx = connectors.findIndex(c => c.id === 'injected' || c.name.toLowerCase().includes('metamask'));
      if (metaMaskIdx >= 0) {
        detectedConnectors['metaMask'] = { index: metaMaskIdx, name: connectors[metaMaskIdx].name, id: connectors[metaMaskIdx].id };
      }

      // Look for WalletConnect
      const walletConnectIdx = connectors.findIndex(c => c.id === 'walletConnect' || c.name.toLowerCase().includes('walletconnect'));
      if (walletConnectIdx >= 0) {
        detectedConnectors['walletConnect'] = { index: walletConnectIdx, name: connectors[walletConnectIdx].name, id: connectors[walletConnectIdx].id };
      }

      // Look for Ledger
      const ledgerIdx = connectors.findIndex(c => c.id === 'ledger' || c.name.toLowerCase().includes('ledger'));
      if (ledgerIdx >= 0) {
        detectedConnectors['ledger'] = { index: ledgerIdx, name: connectors[ledgerIdx].name, id: connectors[ledgerIdx].id };
      }

      setAvailableConnectors(detectedConnectors);
    } else {
      console.log("No connectors available");
    }
  }, [connectors]);

  const handleConnect = async (connectorKey: string) => {
    try {
      if (!isConnected) {
        if (connectors.length === 0 || !availableConnectors[connectorKey]) {
          throw new Error(`The ${connectorKey === 'metaMask' ? 'MetaMask' : connectorKey === 'walletConnect' ? 'WalletConnect' : 'Ledger'} connector is not available. Please ensure the provider is installed or enabled.`);
        }
        const { index, name } = availableConnectors[connectorKey];
        console.log(`Attempting connection with ${name} (index: ${index})`);
        const connector = connectors[index];
        await connect({ connector });
        setOpen(false);
        toast({
          title: "Connection successful",
          description: `Connected with ${name}`,
        });
      } else {
        await signIn();
        toast({
          title: "Successfully signed in",
          description: "You can now create and interact with stories",
        });
        setOpen(false);
      }
    } catch (error: any) {
      console.error(`Connection failed for ${connectorKey}:`, error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error.message || `Failed to connect with ${connectorKey === 'metaMask' ? 'MetaMask' : connectorKey === 'walletConnect' ? 'WalletConnect' : 'Ledger'}. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isSigningIn}
          variant={address ? "outline" : "default"}
          className="flex items-center button-pop"
          onClick={() => {
            console.log("Connect Wallet button clicked - Debug Log");
            setOpen(true);
          }}
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <Button
            disabled={!availableConnectors['metaMask']}
            onClick={() => handleConnect('metaMask')}
            className="flex items-center justify-center gap-2 button-pop"
          >
            <Wallet className="h-5 w-5" />
            Connect MetaMask
          </Button>
          <Button
            disabled={!availableConnectors['walletConnect']}
            onClick={() => handleConnect('walletConnect')}
            variant="outline"
            className="flex items-center justify-center gap-2 button-pop"
          >
            <QrCode className="h-5 w-5" />
            Connect WalletConnect
          </Button>
          <Button
            disabled={!availableConnectors['ledger']}
            onClick={() => handleConnect('ledger')}
            variant="outline"
            className="flex items-center justify-center gap-2 button-pop"
          >
            <Lock className="h-5 w-5" />
            Connect Ledger
          </Button>
          <div className="flex flex-col items-center gap-2 border-t pt-4">
            <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
              Note: Wallet options are disabled if the provider is not detected. Ensure the extension or app is installed.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}