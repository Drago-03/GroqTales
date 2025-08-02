/**

import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useState } from 'react';

  export function useWeb3Auth() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signIn = async () => {
    try {
      setIsSigningIn(true);

      if (!address) throw new Error('No wallet connected');

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to StoryShare',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: await generateNonce(),
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Send to backend for verification
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });

      if (!response.ok) throw new Error('Failed to verify signature');

      return await response.json();
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    } finally {
      setIsSigningIn(false);
}
  };

  const generateNonce = async () => {
    const response = await fetch('/api/auth/nonce');
    const { nonce } = await response.json();
    return nonce;
  };

  return {
    address,
    isConnected,
    isSigningIn,
    connect,
    disconnect,
    signIn,
    connectors,
  };
}