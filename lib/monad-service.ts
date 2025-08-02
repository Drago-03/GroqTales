/**
 * Monad Blockchain Integration Service
 * 
 * This service provides functions to interact with the Monad blockchain
 * for NFT minting, transfer, and management.

import { ethers } from 'ethers';
import { GROQ_MODELS } from './groq-service';

// NFT Contract ABI - simplified for this example
const NFT_CONTRACT_ABI = [
  " mint(address to, string memory tokenURI) external returns (uint256)",
  " ownerOf(uint256 tokenId) external view returns (address)",
  " tokenURI(uint256 tokenId) external view returns (string memory)",
  " transferFrom(address from, address to, uint256 tokenId) external",
  " totalSupply() external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Contract addresses - would be environment variables in production
const MONAD_TESTNET_RPC = "https://rpc.testnet.monad.xyz/json-rpc";
const NFT_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Placeholder

export async function mintStoryNFT(
  metadata: StoryMetadata, 
  ownerAddress: string,
  signer: ethers.Signer
): Promise<MintedNFT> {
  try {
    // 1. Pin metadata to IPFS
    const tokenURI = await pinToIPFS(metadata);

    // 2. Get contract with signer
    const nftContract = getNftContract(signer);

    // 3. Mint the NFT
    const mintTx = await nftContract.mint(ownerAddress, tokenURI);
    const receipt = await mintTx.wait();

    // 4. Get the token ID from the emitted event
    const transferEvent = receipt.logs.find(
      (log: any) => log.fragment && log.fragment.name === 'Transfer'
    );

    if (!transferEvent) {
      throw new Error("Transfer event not found in transaction receipt");
}
    const tokenId = transferEvent.args[2].toString();

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

export async function getStoryNFT(tokenId: string): Promise<MintedNFT | null> {
  try {
    const provider = getMonadProvider();
    const nftContract = getNftContract(provider);

    // Get the owner
    const owner = await nftContract.ownerOf(tokenId);

    // Get the token URI
    const tokenURI = await nftContract.tokenURI(tokenId);

    // Fetch metadata (in a real app, this would fetch from IPFS)
    // Here we simulate by extracting from the fake IPFS hash
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
 * 

export async function generateAndMintAIStory(
  prompt: string,
  authorAddress: string,
  signer: ethers.Signer,
  title?: string,
  genre?: string,
  apiKey?: string
): Promise<MintedNFT> {
  try {
    // Import dynamically to avoid circular dependencies
    const { generateStoryContent } = await import('./groq-service');

    // Generate system prompt based on genre
    let systemPrompt = "You are a creative writer tasked with writing an engaging, original story.";
    if (genre) {
      systemPrompt += ` The story should be in the ${genre.replace('-', ' ')} genre.`;
}
    // Generate the story content using Groq
    console.log("Generating story with Groq...");
    const storyContent = await generateStoryContent(
      prompt,
      undefined, // Use default model
      {
        temperature: 0.7,
        max_tokens: 3000,
        system_prompt: systemPrompt,
        apiKey // Pass the custom API key if provided
}
    );

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
    const excerpt = storyContent.length > 150 
      ? storyContent.substring(0, 150) + "..."
      : storyContent;

    // Create metadata
    const metadata: StoryMetadata = {
      title: storyTitle || "Untitled AI Story",
      description: excerpt,
      content: storyContent,
      excerpt,
      author: "AI Generated",
      authorAddress,
      coverImage: `https://source.unsplash.com/random/800x600/?${genre || 'story'}`,
      genre: genre || "fiction",
      createdAt: new Date().toISOString(),
      aiModel: "Groq AI",
      aiPrompt: prompt,
      tags: genre ? [genre] : ["fiction"]
    };

    // Pin metadata to IPFS
    console.log("Uploading to IPFS...");
    const ipfsHash = await pinToIPFS(metadata);

    // Mint the NFT
    console.log("Minting NFT...");
    return await mintStoryNFT(metadata, authorAddress, signer);
  } catch (error) {
    console.error("Error in generateAndMintAIStory:", error);
    throw error;
}
}