import { NextResponse } from "next/server";
import { JsonRpcProvider, Wallet, Contract } from "ethers";

// Environment variables for Monad connection
// These should be updated with actual Monad testnet/mainnet details when available
const MONAD_RPC_URL = process.env.MONAD_RPC_URL || "https://monad-testnet-rpc.example.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.MONAD_STORY_NFT_ADDRESS || "";

// ABI for MonadStoryNFT contract - minimal subset needed for minting
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

export async function POST(req: Request) {
  try {
    const { storyHash, metadataURI, userAddress } = await req.json();

    console.log('Minting request received:', { storyHash, metadataURI, userAddress });
    
    if (!storyHash || !metadataURI) {
      return NextResponse.json({ error: "Missing required parameters: storyHash and metadataURI are required" }, { status: 400 });
    }

    if (!PRIVATE_KEY || !CONTRACT_ADDRESS || MONAD_RPC_URL.includes('example.com')) {
      console.error('Environment variables not properly configured for Monad connection');
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 503 });
    }

    // Connect to Monad network
    console.log('Connecting to Monad network at:', MONAD_RPC_URL);
    const provider = new JsonRpcProvider(MONAD_RPC_URL);
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
      transactionHash: receipt.transactionHash
    });
  } catch (error: any) {
    console.error("Error minting NFT on Monad:", error);
    return NextResponse.json({ error: error.message || "Failed to mint NFT", success: false }, { status: 500 });
  }
} 