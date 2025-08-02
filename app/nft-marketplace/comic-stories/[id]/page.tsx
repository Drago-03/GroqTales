"use client";

import React from "react";


import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useWeb3 } from "@/components/providers/web3-provider";
import { Heart, Eye, MessageSquare, Share2, ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Download, Gift, ShoppingCart, Sparkles, Lock, ExternalLink } from "lucide-react";

// Mock data to get comic by ID (would be replaced by actual API call)
  /**
   * Retrieves comicbyid data
   * 

function getComicById(id: string) {
  // This is just for demo - you would fetch from API
  const mockComic = {
    id: parseInt(id),
    title: `Neo Mars: Chronicles ${id}`,
    author: "ComicArtist88", // Using a username format for registered users
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=creator${id}`,
    coverImage: `https://picsum.photos/seed/${id}/800/1200`,
    price: "0.35 ETH",
    likes: 520,
    views: 2337,
    pages: 12,
    genre: "Sci-Fi",
    rarity: "rare",
    description: "An epic sci-fi comic story set on Mars in the year 2187. Follow Commander Alex Chen and the Neo Mars exploration team as they uncover the planet's ancient secrets.",
    summary: "In the year 2187, humanity has colonized Mars and established the first interplanetary society. But when mysterious signals begin emanating from Jupiter's moon Europa, a team of elite explorers is dispatched to investigate the unknown. Led by Commander Alex Chen, the crew of the starship 'Odyssey' must navigate treacherous space anomalies and confront an ancient alien technology that could either elevate humanity to the stars or lead to its extinction.",
    previewImages: [
      `https://picsum.photos/seed/${id}-1/800/600`,
      `https://picsum.photos/seed/${id}-2/800/600`,
      `https://picsum.photos/seed/${id}-3/800/600`,
    ],
    fullImages: [
      `https://picsum.photos/seed/${id}-1/800/600`,
      `https://picsum.photos/seed/${id}-2/800/600`,
      `https://picsum.photos/seed/${id}-3/800/600`,
      `https://picsum.photos/seed/${id}-4/800/600`,
      `https://picsum.photos/seed/${id}-5/800/600`,
      `https://picsum.photos/seed/${id}-6/800/600`,
      `https://picsum.photos/seed/${id}-7/800/600`,
      `https://picsum.photos/seed/${id}-8/800/600`,
      `https://picsum.photos/seed/${id}-9/800/600`,
      `https://picsum.photos/seed/${id}-10/800/600`,
      `https://picsum.photos/seed/${id}-11/800/600`,
      `https://picsum.photos/seed/${id}-12/800/600`,
    ],
    isAnimated: Math.random() > 0.7, // Randomly decide if it's animated
    dateCreated: "2023-12-20",
    tokenId: `0x${Math.floor(Math.random() * 100000).toString(16)}`,
    contractAddress: "0x7C3a7171F34D9e4d81A4D0fBecA2212e4c5F9fA4",
    transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    owner: "CryptoCollector42", // Using a username format for registered users
    isOwned: Math.random() > 0.5, // Randomly decide if user owns it
    relatedComics: [
      { id: 201, title: "Space Warriors: Rebellion", author: "CosmicArtist", coverImage: `https://picsum.photos/seed/201/400/600`, rarity: "common" },
      { id: 202, title: "Neon City 2200", author: "NeonDrawer", coverImage: `https://picsum.photos/seed/202/400/600`, rarity: "rare" },
      { id: 203, title: "Quantum Cats: Paradox", author: "QuantumArtist", coverImage: `https://picsum.photos/seed/203/400/600`, rarity: "legendary" }
    ],
    tags: ["sci-fi", "space", "futuristic", "exploration", "aliens", "mars"]
  };

  return mockComic;
}
export default function ComicStoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { account } = useWeb3();
  const [activeTab, setActiveTab] = useState("preview");
  const [currentPage, setCurrentPage] = useState(0);

  // In a real app, you'd fetch this data from an API
  const [comic, setComic] = useState(getComicById(params.id as string));
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Effect to track views
  useEffect(() => {
    // Increment views when component mounts
    setComic(prev => ({
      ...prev,
      views: prev.views + 1
    }));

    // This would call an API to register the view in a real app
    // api.trackView(comic.id);
  }, []);

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
      description: `Starting purchase process for "${comic.title}"`,
    });

    // Simulate the purchase process
    setTimeout(() => {
      setComic(prev => ({
        ...prev,
        isOwned: true,
        owner: account
      }));

      toast({
        title: "Purchase Successful!",
        description: `You are now the proud owner of "${comic.title}"`,
      });
    }, 2000);
  };

  const handleLike = () => {
    if (isLiked) return;

    setIsLiked(true);
    setComic(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));

    toast({
      title: "Comic Liked",
      description: "You've liked this comic!",
    });

    // This would call an API to register the like in a real app
    // api.likeComic(comic.id);
  };

  const downloadComicAsPDF = () => {
    setIsDownloading(true);

    // Simulate PDF generation and download
    setTimeout(() => {
      // In a real app, this would generate an actual PDF with all the comic pages
      // For demo purposes, we'll just show a success message
      toast({
        title: "Comic Downloaded",
        description: `"${comic.title}" has been downloaded as a PDF file.`,
      });
      setIsDownloading(false);
    }, 1500);
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500 text-white";
      case "uncommon": return "bg-green-500 text-white";
      case "rare": return "bg-blue-500 text-white";
      case "legendary": return "bg-amber-500 text-white";
      default: return "bg-gray-500 text-white";
}
  };

  // Navigate to next page
  const nextPage = () => {
    const maxPages = comic.isOwned ? comic.fullImages.length : comic.previewImages.length;
    setCurrentPage((prev) => (prev + 1) % maxPages);
  };

  // Navigate to previous page
  const prevPage = () => {
    const maxPages = comic.isOwned ? comic.fullImages.length : comic.previewImages.length;
    setCurrentPage((prev) => (prev === 0 ? maxPages - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 via-background to-background dark:from-purple-950/10 dark:via-background overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background blur effect */}
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={comic.coverImage}
            alt={comic.title}
            fill
            className="object-cover blur-2xl opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()} 
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Comic Cover */}
              <div className="md:w-1/4 flex-shrink-0">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-[3/4] shadow-2xl"
                >
                  <Image
                    src={comic.coverImage}
                    alt={comic.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />

                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Badge className={`capitalize ${getRarityColor(comic.rarity)}`}>
                      {comic.rarity}
                    </Badge>

                    {comic.isAnimated && (
                      <Badge className="bg-purple-600 text-white flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Animated
                      </Badge>
                    )}
                  </div>
                </motion.div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="px-3 py-1">{comic.genre}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {comic.pages} pages
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-2" />
                      <span>{comic.likes} likes</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-blue-500 mr-2" />
                      <span>{comic.views} views</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {comic.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {comic.isOwned ? comic.owner.substring(0, 2).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{comic.isOwned ? "Owned by you" : "Not owned"}</p>
                        <p className="text-xs text-muted-foreground">
                          {comic.isOwned ? `Since ${comic.dateCreated}` : `Available for ${comic.price}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {comic.isOwned && (
                    <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 bg-purple-50/50 dark:bg-purple-950/20">
                      <h3 className="font-semibold flex items-center text-purple-800 dark:text-purple-400">
                        <Gift className="h-4 w-4 mr-2" />
                        You own this NFT
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This comic NFT is part of your collection since {comic.dateCreated}
                      </p>
                    </div>
                  )}

                  {!comic.isOwned && (
                    <Button 
                      onClick={handlePurchase}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase for {comic.price}
                    </Button>
                  )}
                </div>
              </div>

              {/* Comic Info */}
              <div className="md:w-3/4 overflow-hidden">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-4xl font-bold gradient-heading mb-3">{comic.title}</h1>

                  <div className="flex items-center mb-6">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={comic.authorAvatar} alt={comic.author} />
                      <AvatarFallback>{comic.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comic.author}</p>
                      <p className="text-sm text-muted-foreground">
                        Published on {comic.dateCreated}
                      </p>
                    </div>

                    <div className="ml-auto">
                      <Button 
                        variant={isLiked ? "default" : "ghost"}
                        size="sm" 
                        onClick={handleLike}
                        className={`flex items-center ${isLiked ? 'bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/40' : ''}`}
                        disabled={isLiked}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current text-red-500' : 'text-red-500'}`} />
                        Like {comic.likes > 0 && `(${comic.likes})`}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/40 border p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-2">Story Summary</h3>
                    <p className="italic">{comic.summary}</p>
                  </div>

                  <p className="text-muted-foreground mb-6">{comic.description}</p>
                </motion.div>
              </div>
            </div>

            {/* Comic Preview/Reading Section */}
            <div className="mt-4">
              <Tabs defaultValue="preview" onValueChange={setActiveTab} className="mb-8">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="ownership">Ownership</TabsTrigger>
                </TabsList>

                <div className="mt-4 max-h-[60vh] overflow-auto">
                  <TabsContent value="preview" className="m-0 h-full">
                    <div className="relative aspect-video max-w-4xl mx-auto border rounded-lg overflow-hidden bg-black">
                      {/* Comic Page Display */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative w-full h-full"
                        >
                          <Image
                            src={comic.isOwned ? comic.fullImages[currentPage] : comic.previewImages[currentPage]}
                            alt={`${comic.title} - Page ${currentPage + 1}`}
                            fill
                            className="object-contain"
                          />

                          {/* Lock overlay for non-owned pages */}
                          {!comic.isOwned && currentPage >= comic.previewImages.length - 1 && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-6">
                              <Lock className="h-16 w-16 mb-4 text-purple-400" />
                              <h3 className="text-xl font-bold mb-2">Purchase to Unlock Full Comic</h3>
                              <p className="text-center mb-6 max-w-md">
                                This is just a preview. Purchase this NFT to unlock all {comic.pages} pages of this amazing comic.
                              </p>
                              <Button 
                                onClick={handlePurchase}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Purchase for {comic.price}
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation Controls */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                        onClick={prevPage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                        onClick={nextPage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>

                      {/* Page indicator */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="bg-black/70 text-white px-4 py-1 rounded-full text-sm">
                          Page {currentPage + 1} of {comic.isOwned ? comic.fullImages.length : `${comic.previewImages.length} (Preview)`}
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="mt-6 max-w-4xl mx-auto">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {(comic.isOwned ? comic.fullImages : comic.previewImages).map((img, idx) => (
                            <CarouselItem key={idx} className="basis-1/6 md:basis-1/8">
                              <div 
                                className={`relative aspect-[3/2] cursor-pointer border-2 rounded overflow-hidden ${currentPage === idx ? 'border-purple-500' : 'border-transparent'}`}
                                onClick={() => setCurrentPage(idx)}
                              >
                                <Image
                                  src={img}
                                  alt={`Thumbnail ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                {!comic.isOwned && idx === comic.previewImages.length - 1 && (
                                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <Lock className="h-4 w-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>

                    {comic.isOwned && (
                      <div className="mt-6 flex justify-center">
                        <Button 
                          variant="outline" 
                          onClick={downloadComicAsPDF}
                          disabled={isDownloading}
                          className="mx-auto"
                        >
                          {isDownloading ? 
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div> :
                            <Download className="h-4 w-4 mr-2" />
}
                          Download Full Comic as PDF
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="m-0 h-full">
                    <div className="space-y-6 pb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Comic Details</h3>
                        <div className="bg-muted/40 p-4 rounded-lg border mb-4">
                          <h4 className="font-medium mb-2">Story Synopsis</h4>
                          <p className="text-muted-foreground">{comic.summary}</p>
                        </div>
                        <p className="text-muted-foreground">{comic.description}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Pages</div>
                            <div className="text-xl font-semibold">{comic.pages}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Genre</div>
                            <div className="text-xl font-semibold">{comic.genre}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Rarity</div>
                            <div className="text-xl font-semibold capitalize">{comic.rarity}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Created On</div>
                            <div className="text-xl font-semibold">{comic.dateCreated}</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Rarity Level</h3>
                        <div className="p-4 rounded-lg border">
                          <div className="flex items-center mb-2">
                            <Badge className={`capitalize mr-2 ${getRarityColor(comic.rarity)}`}>
                              {comic.rarity}
                            </Badge>
                            <span className="font-medium">Comic NFT</span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {comic.rarity === "common" && "Common NFTs are the most abundant in the marketplace. They're still great collectibles!"}
                            {comic.rarity === "uncommon" && "Uncommon NFTs are harder to find than common ones, making them more valuable to collectors."}
                            {comic.rarity === "rare" && "Rare NFTs are limited and highly sought after by collectors, offering unique artwork and prestige."}
                            {comic.rarity === "legendary" && "Legendary NFTs are extremely rare and valuable collectibles, representing the pinnacle of digital art ownership."}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {comic.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="capitalize">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {comic.isAnimated && (
                        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <h4 className="font-medium text-purple-800 dark:text-purple-300 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Animated Content
                          </h4>
                          <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                            This comic features special animated sequences that bring the story to life!
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="ownership" className="m-0 h-full">
                    <div className="space-y-6 pb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Ownership Details</h3>
                        <div className="bg-card p-4 rounded-lg border">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar>
                              <AvatarImage src={comic.authorAvatar} />
                              <AvatarFallback>{comic.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{comic.author}</p>
                              <p className="text-sm text-muted-foreground">Creator</p>
                            </div>
                          </div>

                          <div className="border-t border-border pt-4 mt-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={comic.isOwned ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${comic.owner}` : comic.authorAvatar} />
                                <AvatarFallback>{(comic.isOwned ? comic.owner : comic.author).substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{comic.isOwned ? comic.owner : comic.author}</p>
                                <p className="text-sm text-muted-foreground">Current Owner</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Blockchain Information</h3>
                        <div className="p-4 rounded-lg border space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Chain</span>
                            <span className="font-medium">Ethereum</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contract</span>
                            <span className="font-medium">GroqTalesNFT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Token ID</span>
                            <span className="font-medium">#{comic.tokenId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Transaction</span>
                            <span className="font-medium text-xs truncate w-32">
                              {comic.transactionHash.substring(0, 10)}...
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Royalty</span>
                            <span className="font-medium">10%</span>
                          </div>
                          <div className="mt-2 pt-2 border-t text-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7 w-full"
                              onClick={() => window.open(`https://etherscan.io/tx/${comic.transactionHash}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1.5" />
                              View on Etherscan
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Ownership Benefits</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Full access to all {comic.pages} pages of the comic</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Digital ownership verified on the blockchain</span>
                          </li>
                          {comic.isAnimated && (
                            <li className="flex items-start">
                              <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span>Access to exclusive animated sequences</span>
                            </li>
                          )}
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Ability to resell this NFT on the marketplace</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Exclusive access to creator's community</span>
                          </li>
                        </ul>
                      </div>

                      {!comic.isOwned && (
                        <Button 
                          onClick={handlePurchase}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase for {comic.price}
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Related Comics Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">More Comics Like This</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comic.relatedComics.map((related) => (
            <Link 
              key={related.id} 
              href={`/nft-marketplace/comic-stories/${related.id}`}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <div className="relative aspect-[2/3] bg-muted">
                  <Image
                    src={related.coverImage}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={`capitalize ${getRarityColor(related.rarity)}`}>
                      {related.rarity}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{related.title}</h3>
                  <p className="text-xs text-muted-foreground">by {related.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}