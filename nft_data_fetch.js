import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: "tF_nnTXDR1ZAP6cejc5WWqsu5uMLdTgT",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// Print owner's wallet address:
const ownerAddr = "vitalik.eth";
console.log("fetching NFTs for address:", ownerAddr);
console.log("...");

// Print total NFT count returned in the response:
const nftsForOwner = await alchemy.nft.getNftsForOwner("vitalik.eth");
console.log("number of NFTs found:", nftsForOwner.totalCount);
console.log("...");

// Print contract address and tokenId for each NFT:
for (const nft of nftsForOwner.ownedNfts) {
  console.log("===");
  console.log("contract address:", nft.contract.address);
  console.log("token ID:", nft.tokenId);
}
console.log("===");

// Fetch metadata for a particular NFT:
console.log("fetching metadata for a Crypto Coven NFT...");
const response = await alchemy.nft.getNftMetadata(
  "0x5180db8F5c931aaE63c74266b211F580155ecac8",
  "1590"
);

// Uncomment this line to see the full api response:
// console.log(response);

// Print some commonly used fields with error handling:
console.log("NFT name: ", response.title || 'Not available');
console.log("token type: ", response.tokenType || 'Not available');
console.log("tokenUri: ", response.tokenUri ? response.tokenUri.gateway : 'Not available');
console.log("image url: ", response.rawMetadata && response.rawMetadata.image ? response.rawMetadata.image : 'Not available');
console.log("time last updated: ", response.timeLastUpdated || 'Not available');
console.log("==="); 