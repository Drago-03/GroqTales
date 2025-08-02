'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Eye,
  ShoppingCart,
  Search,
  Filter,
  TrendingUp,
  Star,
  Palette,
  BookOpen,
  Users,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useWeb3 } from '@/components/providers/web3-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface NFTStory {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  price: string;
  likes: number;
  views: number;
  genre: string;
  isTop10?: boolean;
  sales?: number;
  description: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

const featuredNFTs: NFTStory[] = [
  {
    id: '1',
    title: "The Last Dragon's Tale",
    author: 'Elena Stormweaver',
    authorAvatar:
      'https://api.dicebear.com/7.x/bottts/svg?seed=Elena&backgroundColor=f3e8ff',
    coverImage:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80',
    price: '2.5 ETH',
    likes: 1247,
    views: 15420,
    genre: 'Epic Fantasy',
    isTop10: true,
    sales: 156,
    description:
      'An epic tale of the last dragon and the young mage destined to either save or destroy the realm.',
    rarity: 'Legendary',
  },
  {
    id: '2',
    title: 'Neon Shadows',
    author: 'Marcus Cyberpunk',
    authorAvatar:
      'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus&backgroundColor=e0f2fe',
    coverImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop&q=80',
    price: '1.8 ETH',
    likes: 892,
    views: 12300,
    genre: 'Cyberpunk',
    isTop10: true,
    sales: 89,
    description:
      'A gritty cyberpunk noir set in Neo-Tokyo where memories are currency and identity is fluid.',
    rarity: 'Epic',
  },
  {
    id: '3',
    title: 'The Quantum Paradox',
    author: 'Dr. Sarah Chen',
    authorAvatar:
      'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah&backgroundColor=fef3c7',
    coverImage:
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=1200&fit=crop&q=80',
    price: '3.2 ETH',
    likes: 1456,
    views: 18750,
    genre: 'Hard Sci-Fi',
    isTop10: true,
    sales: 203,
    description:
      'A mind-bending exploration of quantum mechanics and parallel universes through the eyes of a brilliant physicist.',
    rarity: 'Legendary',
  },
];

function generateAdditionalNFTs(): NFTStory[] {
  const genres = [
    'Fantasy',
    'Sci-Fi',
    'Mystery',
    'Romance',
    'Thriller',
    'Horror',
    'Adventure',
  ];
  const rarities: NFTStory['rarity'][] = [
    'Common',
    'Rare',
    'Epic',
    'Legendary',
  ];

  return Array.from({ length: 20 }, (_, index) => ({
    id: `nft-${index + 4}`,
    title: `Story Collection #${index + 4}`,
    author: `Author ${index + 4}`,
    authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=Author${index + 4}&backgroundColor=f0f9ff`,
    coverImage: `https://images.unsplash.com/photo-${1500000000000 + index * 1000000}?w=800&h=1200&fit=crop&q=80`,
    price: `${(Math.random() * 3 + 0.5).toFixed(1)} ETH`,
    likes: Math.floor(Math.random() * 1000) + 100,
    views: Math.floor(Math.random() * 10000) + 1000,
    genre: genres[Math.floor(Math.random() * genres.length)],
    sales: Math.floor(Math.random() * 100) + 10,
    description: `A captivating ${genres[Math.floor(Math.random() * genres.length)].toLowerCase()} story that will keep you on the edge of your seat.`,
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
  }));
}

function NFTCard({
  nft,
  onLike,
  onPurchase,
}: {
  nft: NFTStory;
  onLike: (id: string) => void;
  onPurchase: (id: string) => void;
}) {
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-yellow-500 border-yellow-500';
      case 'Epic':
        return 'text-purple-500 border-purple-500';
      case 'Rare':
        return 'text-blue-500 border-blue-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        <div className="relative">
          <img
            src={nft.coverImage}
            alt={nft.title}
            className="w-full h-64 object-cover"
          />
          {nft.isTop10 && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500">
              <Star className="w-3 h-3 mr-1" />
              Top 10
            </Badge>
          )}
          {nft.rarity && (
            <Badge
              variant="outline"
              className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)}`}
            >
              {nft.rarity}
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{nft.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <img
              src={nft.authorAvatar}
              alt={nft.author}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-muted-foreground">{nft.author}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {nft.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary">{nft.genre}</Badge>
            <div className="text-lg font-bold text-primary">{nft.price}</div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{nft.likes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{nft.views}</span>
              </span>
              {nft.sales && (
                <span className="flex items-center space-x-1">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{nft.sales}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLike(nft.id)}
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-1" />
              Like
            </Button>
            <Button onClick={() => onPurchase(nft.id)} className="flex-1">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function NFTGalleryPage() {
  const [nfts, setNfts] = useState<NFTStory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'likes' | 'recent'>('likes');
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { account, connected, connectWallet } = useWeb3();

  useEffect(() => {
    // Simulate loading NFTs
    const timer = setTimeout(() => {
      setNfts([...featuredNFTs, ...generateAdditionalNFTs()]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLike = (id: string) => {
    if (!connected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to like this story',
        variant: 'destructive',
      });
      return;
    }

    setNfts((prev) =>
      prev.map((nft) =>
        nft.id === id ? { ...nft, likes: nft.likes + 1 } : nft
      )
    );

    toast({
      title: 'Liked!',
      description: 'You liked this story',
    });
  };

  const handlePurchase = (id: string) => {
    if (!connected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to purchase this NFT',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Purchase Initiated',
      description: 'Starting the NFT purchase process...',
    });
  };

  const filteredNFTs = nfts.filter((nft) => {
    const matchesSearch =
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || nft.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'likes':
        return b.likes - a.likes;
      case 'recent':
        return (
          parseInt(b.id.split('-')[1] || '0') -
          parseInt(a.id.split('-')[1] || '0')
        );
      default:
        return 0;
    }
  });

  const genres = ['all', ...Array.from(new Set(nfts.map((nft) => nft.genre)))];

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading NFT Gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center space-x-2">
          <Palette className="h-8 w-8 text-primary" />
          <span>NFT Story Gallery</span>
        </h1>
        <p className="text-muted-foreground">
          Discover, collect, and trade unique story NFTs from talented creators
          worldwide
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search stories or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'price' | 'likes' | 'recent')
              }
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="likes">Most Liked</option>
              <option value="price">Highest Price</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {sortedNFTs.length} of {nfts.length} stories
          </p>
          {!connected && (
            <Button onClick={connectWallet} variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {sortedNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onLike={handleLike}
              onPurchase={handlePurchase}
            />
          ))}
        </AnimatePresence>
      </div>

      {sortedNFTs.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No stories found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find more stories.
          </p>
        </div>
      )}
    </div>
  );
}
