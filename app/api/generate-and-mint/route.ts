import { NextRequest, NextResponse } from 'next/server';
import { generateAndMintAIStory } from '@/lib/monad-service';
import { ethers } from 'ethers';

// Private key for minting (NEVER do this in production)
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

/**
 * @api {post} /api/generate-and-mint Generate story with Groq AI and mint as NFT on Monad
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, ownerAddress, title, genre, apiKey } = body;

    if (!prompt || !ownerAddress) {
      return NextResponse.json({ 
        error: 'Missing required parameters. Prompt and owner address are required.' 
      }, { status: 400 });
    }

    // Initialize signer with the server's private key
    const provider = new ethers.JsonRpcProvider(
      process.env.MONAD_RPC_URL || "https://rpc.testnet.monad.xyz/json-rpc"
    );
    const signer = new ethers.Wallet(MINTER_PRIVATE_KEY, provider);
    
    // Generate content with Groq and mint as NFT
    const mintedNFT = await generateAndMintAIStory(
      prompt,
      ownerAddress,
      signer,
      title,
      genre,
      apiKey
    );
    
    return NextResponse.json({
      success: true,
      message: "Successfully generated story and minted as NFT",
      nft: mintedNFT
    });
  } catch (error: any) {
    console.error('Generate and mint error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred during the generate and mint process',
    }, { status: 500 });
  }
} 