'use client';

import { motion } from 'framer-motion';
import { Heart, Eye, MessageSquare, Search, ShoppingCart } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useWeb3 } from '@/components/providers/web3-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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

const NFTMarketplace: React.FC = () => {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [sellPrice, setSellPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const account = '0x1234567890abcdef'; // Mock account for placeholder

  const handleSellNFT = async () => {
    if (!selectedNFT || !sellPrice) return;

    setIsLoading(true);
    try {
      // Mock sell NFT logic - replace with actual implementation
      console.log(`Selling NFT ${selectedNFT.tokenId} for ${sellPrice} ETH`);
      // Reset form
      setSelectedNFT(null);
      setSellPrice('');
    } catch (error) {
      console.error('Error selling NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nft-marketplace">
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-xl shadow-2xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-center">
                Sell {selectedNFT.title}
              </h2>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                >
                  Price (ETH)
                </label>
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A transaction fee of 0.001 ETH will be added to the listing.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button
                variant="outline"
                className="rounded-md"
                onClick={() => {
                  setSelectedNFT(null);
                  setSellPrice('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-md bg-amber-600 hover:bg-amber-700"
                onClick={handleSellNFT}
                disabled={!sellPrice || !account}
              >
                Sell NFT
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};
export default NFTMarketplace;
