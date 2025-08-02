/**
 * @fileoverview Core application functionality
 * @module app.api.monad.mint.route.ts
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import { NextResponse } from "next/server";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
// Removed direct import of ipfs-http-client to avoid build-time Node.js module issues
// import { create } from 'ipfs-http-client';

// Environment variables for Ethereum Mainnet connection
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/80e1a002fae34ced944866a7b286884d";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.STORY_NFT_ADDRESS || "";

// IPFS configuration
// These settings align with the provided IPFS config file, which specifies API at /ip4/127.0.0.1/tcp/5001
const IPFS_RPC_API = '/ip4/127.0.0.1/tcp/5001';
const IPFS_GATEWAY = 'https://dweb.link';
const IPFS_FALLBACK_GATEWAY = 'https://ipfs.io';
const IPNS_PUBLISHING_KEY = 'self - k51qzi5uqu5dhindgjwye0f28c6zb6m06gl799ihzivn50kqkl8w0bomgz6rxc';

// Function to dynamically initialize IPFS client only when needed
  /**
   * Retrieves ipfsclient data
   * 
   * @function getIpfsClient
   * @returns {void|Promise<void>} Function return value
   */

async function getIpfsClient() {
  try {
    const { create } = await import('ipfs-http-client');
    return create({ host: '127.0.0.1', port: 5001, protocol: 'http' });
  } catch (error) {
    console.error('Failed to load IPFS client:', error);
    throw new Error('IPFS client initialization failed');
  }
}

// ABI for StoryNFT contract - minimal subset needed for minting
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "storyHash", "type": "string" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "mintStory",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "storyHash", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "StoryMinted",
    "type": "event"
  }
];

  /**
   * Implements POST functionality
   * 
   * @function POST
   * @returns {void|Promise<void>} Function return value
   */


export async function POST(req: Request) {
  try {
    const { storyContent, metadata, userAddress } = await req.json();

    console.log('Minting request received:', { userAddress });
    
    if (!storyContent || !metadata) {
      return NextResponse.json({ error: "Missing required parameters: storyContent and metadata are required" }, { status: 400 });
    }

    if (!PRIVATE_KEY || !CONTRACT_ADDRESS || ETHEREUM_RPC_URL.includes('example.com')) {
      console.error('Environment variables not properly configured for Ethereum connection');
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 503 });
    }

    // Dynamically initialize IPFS client
    let ipfs;
    try {
      ipfs = await getIpfsClient();
    } catch (error) {
      console.error('IPFS client initialization failed:', error);
      return NextResponse.json({ error: "Failed to initialize IPFS client", success: false }, { status: 500 });
    }

    // Upload story content to IPFS
    console.log('Uploading story content to IPFS...');
    const storyResult = await ipfs.add(storyContent);
    const storyHash = storyResult.cid.toString();
    console.log('Story content uploaded to IPFS with CID:', storyHash);

    // Upload metadata to IPFS
    console.log('Uploading metadata to IPFS...');
    const metadataResult = await ipfs.add(JSON.stringify(metadata));
    const metadataURI = metadataResult.cid.toString();
    console.log('Metadata uploaded to IPFS with CID:', metadataURI);

    // Publish to IPNS if needed (optional, can be uncommented if IPNS publishing is required)
    // console.log('Publishing to IPNS...');
    // await ipfs.name.publish(storyHash, { key: IPNS_PUBLISHING_KEY });
    // await ipfs.name.publish(metadataURI, { key: IPNS_PUBLISHING_KEY });
    // console.log('Published to IPNS');

    // Connect to Ethereum Mainnet network
    console.log('Connecting to Ethereum Mainnet network at:', ETHEREUM_RPC_URL);
    const provider = new JsonRpcProvider(ETHEREUM_RPC_URL);
    const wallet = new Wallet(PRIVATE_KEY, provider);
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // Get current mint price
    const mintPrice = await contract.mintPrice();
    console.log('Current mint price:', mintPrice.toString());

    // Mint the NFT on behalf of the user
    // In a production environment, this should be handled client-side or with a more secure backend setup
    console.log('Initiating mint transaction...');
    const tx = await contract.mintStory(storyHash, metadataURI, {
      value: mintPrice,
      gasLimit: 200000
    });

    console.log('Transaction sent, waiting for confirmation:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
    
    // Extract tokenId from event logs
    const tokenIdEvent = receipt.logs?.find((e: any) => e.event === "StoryMinted");
    const tokenId = tokenIdEvent?.args?.tokenId;

    if (!tokenId) {
      console.error('Could not find tokenId in transaction logs', receipt.logs);
      return NextResponse.json({ 
        success: false, 
        error: "Minting succeeded but token ID could not be confirmed", 
        transactionHash: receipt.transactionHash 
      }, { status: 200 });
    }

    console.log('NFT successfully minted with tokenId:', tokenId.toString());
    return NextResponse.json({
      success: true,
      tokenId: tokenId.toString(),
      transactionHash: receipt.transactionHash,
      storyHash,
      metadataURI,
      storyGatewayURL: `${IPFS_GATEWAY}/ipfs/${storyHash}`,
      metadataGatewayURL: `${IPFS_GATEWAY}/ipfs/${metadataURI}`,
      fallbackStoryGatewayURL: `${IPFS_FALLBACK_GATEWAY}/ipfs/${storyHash}`,
      fallbackMetadataGatewayURL: `${IPFS_FALLBACK_GATEWAY}/ipfs/${metadataURI}`
    });
  } catch (error: any) {
    console.error("Error minting NFT on Ethereum Mainnet or uploading to IPFS:", error);
    return NextResponse.json({ error: error.message || "Failed to mint NFT or upload to IPFS", success: false }, { status: 500 });
  }
} 