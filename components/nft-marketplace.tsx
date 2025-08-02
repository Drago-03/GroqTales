"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/components/providers/web3-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Eye, MessageSquare, Search, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NFT {
  tokenId: string;
  title: string;
  price: string;
  seller: string;
  status: string;
  description?: string;
  coverImage?: string;
  genre?: string;
  author?: string;
  likes?: number;
  views?: number;
}

  /**
   * Implements NFTMarketplace functionality
   * 
   * @function NFTMarketplace
   * @returns {void|Promise<void>} Function return value
   */


export function NFTMarketplace() {
  const { account, connectWallet, buyNFTOnBase, sellNFTOnBase, getNFTListings } = useWeb3();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [sellPrice, setSellPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        const listings = await getNFTListings();
        // Filter to show only Tale NFTs (assuming title or metadata indicates 'Story')
        const taleNFTs = listings.filter((nft: NFT) => nft.status === 'listed' && nft.title.toLowerCase().includes('story'));
        setNfts(taleNFTs);
      } catch (error) {
        console.error('Failed to fetch NFT listings:', error);
        console.log('Error: Failed to load NFT listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [getNFTListings]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      console.log('Connection Failed: Could not connect wallet. Please try again.');
    }
  };

  const handleBuyNFT = async (nft: NFT) => {
    if (!account) {
      console.log('Wallet Not Connected: Please connect your wallet to buy NFTs.');
      return;
    }

    try {
      const result = await buyNFTOnBase(nft.tokenId, nft.price);
      console.log(`Purchase Successful: Successfully purchased ${nft.title} (Token ID: ${result.tokenId}). Transaction: ${result.transactionHash}`);
    } catch (error) {
      console.error('Failed to buy NFT:', error);
      console.log('Purchase Failed: Failed to purchase NFT. Please try again.');
    }
  };

  const handleSellNFT = async () => {
    if (!account || !selectedNFT || !sellPrice) {
      console.log('Invalid Input: Please connect your wallet, select an NFT, and set a price to sell.');
      return;
    }

    try {
      const result = await sellNFTOnBase(selectedNFT.tokenId, sellPrice);
      console.log(`Listing Successful: Successfully listed ${selectedNFT.title} for ${sellPrice} ETH. Transaction: ${result.transactionHash}`);
      // Refresh listings after listing
      const listings = await getNFTListings();
      setNfts(listings.filter((nft: NFT) => nft.status === 'listed' && nft.title.toLowerCase().includes('story')));
      setSelectedNFT(null);
      setSellPrice("");
    } catch (error) {
      console.error('Failed to sell NFT:', error);
      console.log('Listing Failed: Failed to list NFT for sale. Please try again.');
    }
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    // Sorting logic can be expanded based on API support or local data
    // For now, it's a placeholder for UI
    let sortedNFTs = [...nfts];
    if (sortOption === "priceLowHigh") {
      sortedNFTs.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === "priceHighLow") {
      sortedNFTs.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortOption === "newest") {
      // Assuming newer NFTs have higher token IDs for demo
      sortedNFTs.sort((a, b) => parseInt(b.tokenId.split('-')[1]) - parseInt(a.tokenId.split('-')[1]));
    }
    setNfts(sortedNFTs);
  };

  const filteredNFTs = nfts.filter(nft => 
    nft.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    nft.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    nft.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tale NFT Marketplace</h1>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "newest" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("newest")}
          >
            Newest
          </Button>
          <Button
            variant={sortBy === "priceLowHigh" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("priceLowHigh")}
          >
            Price: Low to High
          </Button>
          <Button
            variant={sortBy === "priceHighLow" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("priceHighLow")}
          >
            Price: High to Low
          </Button>
        </div>
      </div>

      {!account && (
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-center">
          <p className="text-yellow-800 dark:text-yellow-200 mb-2">You need to connect your wallet to buy or sell NFTs.</p>
          <Button onClick={handleConnectWallet} className="mx-auto">Connect Wallet</Button>
        </div>
      )}

      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search Tale NFTs by title, description, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {loading ? (
        <div className="text-center py-10 text-lg font-medium">Loading Tale NFTs...</div>
      ) : filteredNFTs.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">No Tale NFTs found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <motion.div
              key={nft.tokenId}
              whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-xl group border rounded-xl")}>
                <div className="relative pt-[60%]">
                  <img
                    src={nft.coverImage || '/covers/default.jpg'}
                    alt={nft.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <ShoppingCart className="h-3 w-3 mr-1 text-yellow-400" />
                    {nft.price} ETH
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-6 w-6 border">
                      <AvatarImage src="/avatars/default.png" />
                      <AvatarFallback>{nft.author?.[0] || 'T'}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium truncate">{nft.author || nft.seller.substring(0, 6) + '...' + nft.seller.substring(nft.seller.length - 4)}</p>
                  </div>
                  <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-amber-800 dark:group-hover:text-amber-300 text-gray-800 dark:text-white transition-colors duration-200">{nft.title}</h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">{nft.description || 'A unique Tale NFT from GroqTales'}</p>
                  {nft.genre && (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full text-amber-800 dark:text-amber-200">
                      {nft.genre}
                    </span>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                  <div className="flex space-x-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <div className="flex items-center">
                      <Heart className="h-3.5 w-3.5 mr-1 text-pink-500" />
                      {nft.likes || 0}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      {nft.views || 0}
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full px-4"
                    onClick={() => handleBuyNFT(nft)}
                    disabled={!account}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sell NFT Modal or Section (Simplified for Demo) */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-xl shadow-2xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-center">Sell {selectedNFT.title}</h2>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Price (ETH)</label>
                <Input
                  id="price"
                  type="number"
                  step="0.001"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="0.01"
                  className="border rounded-md focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">A transaction fee of 0.001 ETH will be added to the listing.</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button variant="outline" className="rounded-md" onClick={() => { setSelectedNFT(null); setSellPrice(""); }}>Cancel</Button>
              <Button className="rounded-md bg-amber-600 hover:bg-amber-700" onClick={handleSellNFT} disabled={!sellPrice || !account}>Sell NFT</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default NFTMarketplace; 