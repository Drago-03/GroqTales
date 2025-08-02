"use client";

import React from "react";


import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, ArrowUpRight, Star, BarChart3, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoryCard } from "@/components/story-card";
import { StoryDetailsDialog } from "@/components/story-details-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useWeb3 } from "@/components/providers/web3-provider";
import { StoryCommentsDialog } from "@/components/story-comments-dialog";

interface NFTStory {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  price: string;
  likes: number;
  views: number;
  genre: string;
  description: string;
  sales?: number;
  isTop10?: boolean;
}
// Mock data for top NFT stories
const topNftData: NFTStory[] = [
  {
    id: 1,
    title: "The Quantum Nexus",
    author: "NeuralScribe",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeuralScribe&backgroundColor=b6e3f4",
    coverImage: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800&h=1200&fit=crop&q=80",
    price: "2.5 ETH",
    likes: 1250,
    views: 4800,
    genre: "sci-fi",
    description: "A mind-bending journey through quantum realms and parallel universes.",
    sales: 156,
    isTop10: true
  },
  {
    id: 2,
    title: "Ethereal Dreams",
    author: "DigitalMuse",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DigitalMuse&backgroundColor=ffd6e0",
    coverImage: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=1200&fit=crop&q=80",
    price: "1.8 ETH",
    likes: 980,
    views: 3600,
    genre: "fantasy",
    description: "Where dreams and reality intertwine in a magical realm.",
    sales: 134,
    isTop10: true
  },
  {
    id: 3,
    title: "Neural Dreams",
    author: "CyberInk",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberInk&backgroundColor=f4b6e3",
    coverImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=1200&fit=crop&q=80",
    price: "0.72 ETH",
    likes: 1080,
    views: 13500,
    genre: "Cyberpunk",
    isTop10: true,
    sales: 109,
    description: "In a world where dreams can be digitized, a neural architect discovers a disturbing pattern in the collective unconscious."
  },
  {
    id: 4,
    title: "Echoes of Eternity",
    author: "TimelessScribe",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TimelessScribe&backgroundColor=e3f4b6",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop&q=80",
    price: "0.65 ETH",
    likes: 950,
    views: 12100,
    genre: "Historical Fantasy",
    isTop10: true,
    sales: 98,
    description: "A historian discovers an ancient artifact that allows her to witness pivotal moments throughout human history."
  },
  {
    id: 5,
    title: "Synthetic Hearts",
    author: "AIStoryweaver",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AIStoryweaver&backgroundColor=b6f4c1",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop&q=80",
    price: "0.62 ETH",
    likes: 920,
    views: 11800,
    genre: "Sci-Fi Romance",
    isTop10: true,
    sales: 95,
    description: "A love story between a human and an advanced AI that challenges the very definition of consciousness and emotion."
  },
  {
    id: 6,
    title: "Fractal Memories",
    author: "QuantumPoet",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=QuantumPoet&backgroundColor=f4e3b6",
    coverImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=1200&fit=crop&q=80",
    price: "0.58 ETH",
    likes: 880,
    views: 10900,
    genre: "Psychological Sci-Fi",
    isTop10: true,
    sales: 91,
    description: "A scientist develops technology to explore the fractalized structure of human memory, only to become lost in his own past."
  },
  {
    id: 7,
    title: "Celestial Shadows",
    author: "CosmicWordsmith",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CosmicWordsmith&backgroundColor=c1b6f4",
    coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80",
    price: "0.55 ETH",
    likes: 840,
    views: 10200,
    genre: "Space Opera",
    isTop10: true,
    sales: 87,
    description: "An interstellar conflict between ancient civilizations with a lone diplomat trying to prevent galactic war."
  },
  {
    id: 8,
    title: "Molecular Whispers",
    author: "BioNarrator",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=BioNarrator&backgroundColor=f4c1b6",
    coverImage: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=1200&fit=crop&q=80",
    price: "0.51 ETH",
    likes: 790,
    views: 9800,
    genre: "Biopunk",
    isTop10: true,
    sales: 83,
    description: "In a world where genetic modification is commonplace, a scientist discovers that modified DNA is developing consciousness."
  },
  {
    id: 9,
    title: "Ethereal Frequencies",
    author: "DigitalBard",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DigitalBard&backgroundColor=b6f4e3",
    coverImage: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800&h=1200&fit=crop&q=80",
    price: "0.48 ETH",
    likes: 760,
    views: 9500,
    genre: "Techno-Fantasy",
    isTop10: true,
    sales: 79,
    description: "A radio operator picks up signals from a dimension where magic and technology have merged into a single force."
  },
  {
    id: 10,
    title: "Chronos Fragments",
    author: "TemporalTales",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TemporalTales&backgroundColor=e3b6f4",
    coverImage: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=1200&fit=crop&q=80",
    price: "0.45 ETH",
    likes: 720,
    views: 9200,
    genre: "Time Fantasy",
    isTop10: true,
    sales: 76,
    description: "A story told through fragmented time periods, where the protagonist must piece together reality from disjointed moments."
  },
]; generateRemainingNfts(): NFTStory[] {
  const backgroundImages = [
    "photo-1635776062127-d379bfcba9f8",
    "photo-1518709766631-a6a7f45921c3",
    "photo-1614728263952-84ea256f9679",
    "photo-1579547621869-0d0b7f76b3d3",
    "photo-1639762681485-074b7f938ba0",
    "photo-1632292220916-e9c34dd75db2",
    "photo-1635322966219-b75ed372eb01",
    "photo-1636819488524-a34010abe571"
  ];

  return Array.from({ length: 90 }, (_, index) => {
    const nftIndex = index + 11;
    const hue = (nftIndex * 137.5) % 360;
    const seed = `NFT${nftIndex}`;
    const sales = Math.floor(Math.random() * 100); // Random sales between 0-99

    return {
      id: nftIndex,
      title: `NFT Story #${nftIndex}`,
      author: `Creator${nftIndex}`,
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=hsl(${hue},70%,85%)`,
      coverImage: `https://images.unsplash.com/${backgroundImages[index % backgroundImages.length]}?w=800&h=1200&fit=crop&q=80`,
      price: `${((Math.random() * 2) + 0.1).toFixed(2)} ETH`,
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 5000),
      genre: ["sci-fi", "fantasy", "cyberpunk", "mystery"][Math.floor(Math.random() * 4)],
      description: `An engaging story #${nftIndex} in the digital realm.`,
      sales: sales,
      isTop10: false
    };
  });
}
const nftData: NFTStory[] = [...topNftData, ...generateRemainingNfts()];

export default function NftGalleryPage() {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [activeTab, setActiveTab] = useState("trending");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStory, setSelectedStory] = useState<NFTStory | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const { account } = useWeb3();
  const { toast } = useToast();

  const handleImageError = (id: number) => {
    setImageError(prev => ({...prev, [id]: true}));
  };

  // Filter NFTs by genre
  const filterByGenre = (nfts: NFTStory[]) => {
    if (selectedGenre === "all") return nfts;
    return nfts.filter(nft => nft.genre.toLowerCase() === selectedGenre.toLowerCase());
  };

  // Sort NFTs based on active tab
  const getSortedNFTs = () => {
    let sortedNFTs = [...nftData];

    // First sort based on tab
    switch (activeTab) {
      case "bestsellers":
        sortedNFTs.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      case "newest":
        sortedNFTs.sort((a, b) => b.id - a.id);
        break;
      case "trending":
      default:
        sortedNFTs.sort((a, b) => {
          const scoreA = a.likes + (a.views / 100);
          const scoreB = b.likes + (b.views / 100);
          return scoreB - scoreA;
        });
        break;
}
    // Then filter by genre
    sortedNFTs = filterByGenre(sortedNFTs);

    return sortedNFTs.slice(0, 10);
  };

  const featuredNFTs = getSortedNFTs();

  // Get unique genres from NFT data
  const uniqueGenres = Array.from(new Set(nftData.map(nft => nft.genre.toLowerCase())));

  const handleStoryClick = (story: NFTStory) => {
    setSelectedStory(story);
    setShowDetailsDialog(true);
  };

  const handlePurchase = () => {
    if (!account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      });
      return;
}
    toast({
      title: "Purchase Initiated",
      description: "Starting the NFT purchase process...",
    });
    // Add purchase logic here
  };

  const handleComment = () => {
    if (!selectedStory) return;
    setShowDetailsDialog(false);
    setShowCommentsDialog(true);
  };

  const handleLike = () => {
    if (!account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to like this story",
        variant: "destructive",
      });
      return;
}
    toast({
      title: "Liked!",
      description: "You liked this story",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">NFT Gallery</h1>
          <p className="text-muted-foreground">Explore unique AI-generated story NFTs from our community</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/nft-marketplace" passHref>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Go to Marketplace
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="top10" className="w-full mb-8">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="bestsellers">Best Sellers</TabsTrigger>
          <TabsTrigger value="newest">Newest</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Featured Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            <span className="gradient-heading">
              {activeTab === "trending" && "Top 10 Trending"}
              {activeTab === "bestsellers" && "Top 10 Best Sellers"}
              {activeTab === "newest" && "10 Newest"}
            </span>
            {selectedGenre !== "all" && (
              <span className="gradient-heading"> in {selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)}</span>
            )}
            {" Stories"}
          </h2>
          <Button variant="outline" size="sm" className="gap-1">
            View All <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {featuredNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {featuredNFTs.map((nft) => (
              <Card key={nft.id} className="bg-card border-border hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                    {imageError[nft.id] ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground text-sm">{nft.title}</span>
                      </div>
                    ) : (
                      <Image
                        src={nft.coverImage}
                        alt={nft.title}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(nft.id)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-primary text-white">
                    #{nft.id}
                  </Badge>
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    {imageError[`avatar-${nft.id}`] ? (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs">{nft.author[0]}</span>
                      </div>
                    ) : (
                      <Image
                        src={nft.authorAvatar}
                        alt={nft.author}
                        width={24}
                        height={24}
                        className="rounded-full bg-muted"
                        onError={() => handleImageError(Number(`avatar-${nft.id}`))}
                      />
                    )}
                    <CardTitle className="text-base truncate">{nft.title}</CardTitle>
                  </div>
                  <CardDescription className="truncate">by {nft.author}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{nft.genre}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-3 w-3" />
                      <span>{nft.likes}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t border-border flex justify-between items-center">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                    <span className="text-sm font-medium">{nft.sales || 0} sales</span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 text-primary">
                    {nft.price}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No stories found for the selected genre.
          </div>
        )}
      </div>

      {/* Top 100 Ranking */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {selectedGenre === "all" ? "Top 100 NFT Stories" : `Top 100 ${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Stories`}
        </h2>

        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-3 text-left font-medium">Rank</th>
                <th className="p-3 text-left font-medium">Story</th>
                <th className="p-3 text-left font-medium">Creator</th>
                <th className="p-3 text-left font-medium">Genre</th>
                <th className="p-3 text-left font-medium">Price</th>
                <th className="p-3 text-left font-medium">Sales</th>
                <th className="p-3 text-left font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {filterByGenre(nftData).slice(0, 100).map((nft) => (
                <tr key={nft.id} className={`border-b border-border hover:bg-muted/30 
                  ${nft.isTop10 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''}`}>
                  <td className="p-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${nft.isTop10 ? 'theme-gradient-bg text-white' : 'bg-muted/50'}`}>
                      {nft.id}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {imageError[`table-${nft.id}`] ? (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{nft.title[0]}</span>
                        </div>
                      ) : (
                        <Image
                          src={nft.coverImage}
                          alt={nft.title}
                          width={40}
                          height={40}
                          className="rounded bg-muted object-cover"
                          onError={() => handleImageError(Number(`table-${nft.id}`))}
                        />
                      )}
                      <div>
                        <div className="font-medium">{nft.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {nft.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{nft.author}</td>
                  <td className="p-3">
                    <Badge variant="outline">{nft.genre}</Badge>
                  </td>
                  <td className="p-3 font-medium">{nft.price}</td>
                  <td className="p-3">{nft.sales || 0}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span className="text-sm">{nft.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span className="text-sm">{nft.views}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStory && (
        <>
          <StoryDetailsDialog
            isOpen={showDetailsDialog}
            onClose={() => setShowDetailsDialog(false)}
            story={selectedStory}
            onPurchase={handlePurchase}
            onComment={handleComment}
            onLike={handleLike}
          />

          <StoryCommentsDialog
            isOpen={showCommentsDialog}
            onClose={() => setShowCommentsDialog(false)}
            storyTitle={selectedStory.title}
            comments={[]}
            onAddComment={() => {}}
            isWalletConnected={!!account}
          />
        </>
      )}

      {/* Marketplace CTA Section */}
      <div className="mt-16 p-8 bg-gradient-to-r from-amber-100/30 to-amber-50/30 dark:from-amber-900/20 dark:to-amber-950/20 rounded-xl border border-amber-200/30 dark:border-amber-800/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-3">Ready to Buy or Sell NFTs?</h2>
            <p className="text-muted-foreground max-w-2xl">Visit our NFT marketplace to buy unique story NFTs directly from creators or list your own stories as NFTs for sale.</p>
          </div>
          <Link href="/nft-marketplace" passHref>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Go to NFT Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}