/**
 * Monad Blockchain Integration Service
 * 
 * This service provides functions to interact with the Monad blockchain
 * for NFT minting, transfer, and management.
 */

import { ethers } from 'ethers';

// Story metadata interface for NFT minting
export interface StoryMetadata {
  title: string;
  content: string;
  genre: string;
  author: string;
  timestamp: number;
  aiModel?: string;
  tags?: string[];
  description?: string;
  excerpt?: string;
  authorAddress?: string;
  coverImage?: string;
  createdAt?: string;
  aiPrompt?: string;
}

// Minted NFT result interface
export interface MintedNFT {
  tokenId: string;
  contractAddress?: string;
  transactionHash: string;
  metadata: StoryMetadata;
  owner?: string;
  tokenURI?: string;
}

// Mock IPFS pinning function
async function pinToIPFS(metadata: StoryMetadata): Promise<string> {
  // Mock implementation - in real app this would upload to IPFS
  const jsonData = JSON.stringify(metadata);
  const hexData = Buffer.from(jsonData, 'utf8').toString('hex');
  return `ipfs://Qm${hexData}`;
}

// Mock contract getter
function getNftContract(signerOrProvider: any) {
  // Mock implementation - in real app this would return actual contract
  return {
    mint: async (to: string, tokenURI: string) => ({
      wait: async () => ({
        hash: '0x' + Math.random().toString(16).slice(2),
        logs: [{
          fragment: { name: 'Transfer' },
          args: [ethers.ZeroAddress, to, '1']
        }]
      })
    }),
    ownerOf: async (tokenId: string) => '0x' + Math.random().toString(16).slice(2, 42),
    tokenURI: async (tokenId: string) => `ipfs://mock-${tokenId}`
  };
}

// Mock provider getter
function getMonadProvider() {
  // Mock implementation - in real app this would return actual provider
  return new ethers.JsonRpcProvider('https://rpc.testnet.monad.xyz/json-rpc');
}

/**
 * Mint a story NFT on the Monad blockchain
 */
export async function mintStoryNFT(
  metadata: StoryMetadata, 
  ownerAddress: string,
  signer?: ethers.Signer
): Promise<MintedNFT> {
  try {
    // 1. Pin metadata to IPFS (mock)
    const tokenURI = await pinToIPFS(metadata);

    // 2. Get contract with signer (mock)
    const nftContract = getNftContract(signer);

    // 3. Mint the NFT (mock)
    const mintTx = await nftContract.mint(ownerAddress, tokenURI);
    const receipt = await mintTx.wait();

    // 4. Get the token ID from the emitted event
    const transferEvent = receipt.logs.find(
      (log: any) => log.fragment && log.fragment.name === 'Transfer'
    );

    if (!transferEvent) {
      throw new Error("Transfer event not found in transaction receipt");
    }
    const tokenId = transferEvent.args?.[2]?.toString() || '1';

    // 5. Return minted NFT data
    return {
      tokenId,
      transactionHash: receipt.hash,
      owner: ownerAddress,
      tokenURI,
      metadata
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}

/**
 * Get a story NFT by its token ID
 */
export async function getStoryNFT(tokenId: string): Promise<MintedNFT | null> {
  try {
    const provider = getMonadProvider();
    const nftContract = getNftContract(provider);

    // Get the owner
    const owner = await nftContract.ownerOf(tokenId);

    // Get the token URI
    const tokenURI = await nftContract.tokenURI(tokenId);

    // Fetch metadata (mock - in real app, this would fetch from IPFS)
    const hash = tokenURI.replace('ipfs://', '');
    const hexData = hash.substring(2);
    const jsonData = Buffer.from(hexData, 'hex').toString('utf8');
    const metadata = JSON.parse(jsonData) as StoryMetadata;

    return {
      tokenId,
      transactionHash: '', // Not available in this implementation
      owner,
      tokenURI,
      metadata
    };
  } catch (error) {
    console.error("Error getting NFT:", error);
    return null;
  }
}

/**
 * Generates an AI story with Groq and mints it as an NFT
 */
export async function generateAndMintAIStory(
  prompt: string,
  authorAddress: string,
  signer?: ethers.Signer,
  title?: string,
  genre?: string,
  apiKey?: string
): Promise<MintedNFT> {
  try {
    // Import dynamically to avoid circular dependencies
    const { generateStoryContent } = await import('./groq-service');

    // Generate system prompt based on genre
    let systemPrompt =
      'You are a creative writer tasked with writing an engaging, original story.';
    if (genre) {
      systemPrompt += ` The story should be in the ${genre.replace('-', ' ')} genre.`;
    }
    
    // Generate the story content using Groq
    console.log('Generating story with Groq...');
    const storyContent = await generateStoryContent({
      theme: prompt,
      genre: genre || 'fiction',
      length: 'medium'
    });

    // Extract a title from the first line if not provided
    let storyTitle = title;
    if (storyContent && storyContent.trim() !== '') {
      // Extract title from content if not explicitly provided
      if (!storyTitle) {
        const firstLine = storyContent.split('\n')[0];
        if (firstLine && firstLine.startsWith('# ')) {
          storyTitle = firstLine.substring(2).trim();
        } else if (firstLine) {
          storyTitle = firstLine.trim();
        }
      }
      // Clean the title if it exists
      if (storyTitle) {
        storyTitle = storyTitle.replace(/["']/g, '').trim();
      }
    }
    
    // Generate a short excerpt
    const excerpt =
      storyContent.length > 150
        ? storyContent.substring(0, 150) + '...'
        : storyContent;

    // Create metadata
    const metadata: StoryMetadata = {
      title: storyTitle || 'Untitled AI Story',
      description: excerpt,
      content: storyContent,
      excerpt,
      author: 'AI Generated',
      authorAddress,
      coverImage: `https://source.unsplash.com/random/800x600/?${genre || 'story'}`,
      genre: genre || 'fiction',
      createdAt: new Date().toISOString(),
      aiModel: 'Groq AI',
      aiPrompt: prompt,
      tags: genre ? [genre] : ['fiction'],
      timestamp: Date.now(),
    };

    // Mint the NFT
    console.log('Minting NFT...');
    return await mintStoryNFT(metadata, authorAddress, signer);
  } catch (error) {
    console.error('Error in generateAndMintAIStory:', error);
    throw error;
  }
}
