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
  }
];

export async function POST(req: Request) {
  try {
    const { storyHash, metadataURI, userAddress } = await req.json();

    if (!storyHash || !metadataURI || !userAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Connect to Monad network
    const provider = new JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new Wallet(PRIVATE_KEY, provider);
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // Get current mint price
    const mintPrice = await contract.mintPrice();

    // Mint the NFT on behalf of the user
    // In a production environment, this should be handled client-side or with a more secure backend setup
    const tx = await contract.mintStory(storyHash, metadataURI, {
      value: mintPrice,
      gasLimit: 200000
    });

    const receipt = await tx.wait();
    const tokenId = receipt.logs?.find((e: any) => e.fragment?.name === "StoryMinted")?.args?.tokenId;

    return NextResponse.json({
      success: true,
      tokenId: tokenId?.toString(),
      transactionHash: receipt.transactionHash
    });
  } catch (error: any) {
    console.error("Error minting NFT on Monad:", error);
    return NextResponse.json({ error: error.message || "Failed to mint NFT" }, { status: 500 });
  }
} 