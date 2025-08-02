import { NextRequest, NextResponse } from 'next/server';
import { getStoryNFT, mintStoryNFT, StoryMetadata } from '@/lib/monad-service';
import { ethers } from 'ethers';

// Private key for minting (NEVER do this in production, this should be managed by a secure service)
// In this example context, we're using a dummy key for demonstration only
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

/**

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, metadata, ownerAddress, tokenId } = body;

    switch (action) {
      case 'mint': {
        if (!metadata || !ownerAddress) {
          return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
}
        // Wallet that will sign the transaction - server side
        const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
        const signer = new ethers.Wallet(MINTER_PRIVATE_KEY, provider);

        // Mint the NFT
        const result = await mintStoryNFT(
          metadata as StoryMetadata,
          ownerAddress,
          signer
        );

        return NextResponse.json({ 
          success: true, 
          nft: result 
        });
}
      case 'fetch': {
        if (!tokenId) {
          return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
}
        const nft = await getStoryNFT(tokenId);

        if (!nft) {
          return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
}
        return NextResponse.json({ 
          success: true, 
          nft 
        });
}
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
  } catch (error: any) {
    console.error('Monad API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while processing your request',
        success: false
      },
      { status: 500 }
    );
}
}
/**

export async function GET() {
  try {
    return NextResponse.json({
      network: {
        name: "Monad Testnet",
        chainId: 9090,
        rpcUrl: "https://rpc.testnet.monad.xyz/json-rpc",
        currency: "MONAD"
}
    });
  } catch (error: any) {
    console.error('Error fetching Monad info:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching Monad info' },
      { status: 500 }
    );
}
}