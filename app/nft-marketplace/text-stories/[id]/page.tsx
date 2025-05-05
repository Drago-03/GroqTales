"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useWeb3 } from "@/components/providers/web3-provider";
import { Heart, Eye, MessageSquare, Share2, ArrowLeft, BookOpen, Clock, Download, Gift, ShoppingCart } from "lucide-react";

// Mock data function to get story by ID (would be replaced by actual API call)
function getStoryById(id: string) {
  // This is just for demo - you would fetch from API
  const mockStory = {
    id: parseInt(id),
    title: `Text Story #${id}`,
    author: "StoryWriter42", // Using a username format for registered users
    authorAvatar: `https://api.dicebear.com/7.x/micah/svg?seed=author${id}`,
    coverImage: `https://picsum.photos/seed/${id}/800/1200`,
    price: "0.25 ETH",
    likes: 420,
    views: 1337,
    wordCount: 8500,
    readTime: "25 min",
    genre: "Sci-Fi",
    description: "This is a vibing text story NFT that takes you on a wild journey through space and time.",
    summary: "The year is 2150. Humanity has mastered interstellar travel and established colonies across the solar system. Captain Zara Rhodes, commander of the exploration vessel Nebula, receives a mysterious signal from beyond our galaxy. Against all protocols, she decides to investigate, setting in motion a chain of events that will challenge everything humans believe about their place in the universe.",
    excerpt: "The spacecraft hummed softly as Captain Zara adjusted the quantum stabilizers. Three years into the deep space mission, and they were about to make first contact...",
    fullText: "The spacecraft hummed softly as Captain Zara adjusted the quantum stabilizers. Three years into the deep space mission, and they were about to make first contact. The alien signal had been clear - intelligent life existed beyond Earth. As the ship approached the coordinates, the crew held their breath. What would they find? A new ally? A potential threat? Or something beyond their comprehension? The computer beeped, indicating arrival. 'We're here,' Zara announced, her voice steady despite the adrenaline coursing through her veins. Through the viewscreen, a massive structure appeared, geometrically impossible and pulsing with colors that shouldn't exist. 'What is that?' whispered the science officer. Before anyone could respond, their minds filled with a single thought, not their own: 'Welcome, children of Earth. We've been waiting for you.'",
    tags: ["sci-fi", "space", "first contact"],
    dateCreated: "2023-12-15",
    owner: "CosmicCollector", // Using a username format for registered users
    isOwned: Math.random() > 0.5, // Randomly decide if user owns it
    relatedStories: [
      { id: 101, title: "Quantum Leap", author: "QuantumScribe", coverImage: `https://picsum.photos/seed/101/400/600` },
      { id: 102, title: "Stellar Dreams", author: "DreamWeaver99", coverImage: `https://picsum.photos/seed/102/400/600` },
      { id: 103, title: "Neural Connection", author: "NeuralNarrator", coverImage: `https://picsum.photos/seed/103/400/600` }
    ]
  };
  
  return mockStory;
}

export default function TextStoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { account } = useWeb3();
  const [activeTab, setActiveTab] = useState("story");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [storyData, setStoryData] = useState(() => getStoryById(params.id as string));
  
  const handlePurchase = () => {
    if (!account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      });
      return;
    }
    
    setIsPurchasing(true);
    toast({
      title: "Purchase Initiated",
      description: `Starting purchase process for "${storyData.title}"`,
    });
    
    // Simulate blockchain transaction
    setTimeout(() => {
      toast({
        title: "Transaction Processing",
        description: "Waiting for blockchain confirmation...",
      });
      
      // Simulate transaction success after delay
      setTimeout(() => {
        // Update story ownership state
        setStoryData(prev => ({
          ...prev,
          isOwned: true,
          owner: account.substring(0, 10) // Use part of wallet address as owner
        }));
        
        setIsPurchasing(false);
        toast({
          title: "Purchase Successful!",
          description: `You now own "${storyData.title}"`,
          variant: "default",
        });
      }, 2000);
    }, 1500);
  };
  
  const handleLike = () => {
    toast({
      title: "Story Liked",
      description: "You've liked this story!",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-background dark:from-amber-950/10 dark:via-background overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background blur effect */}
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={storyData.coverImage}
            alt={storyData.title}
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
          
          <div className="flex flex-col md:flex-row gap-10">
            {/* Book Cover */}
            <div className="md:w-1/3 flex-shrink-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[3/4] shadow-2xl"
              >
                <Image
                  src={storyData.coverImage}
                  alt={storyData.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
                {!storyData.isOwned && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-6">
                    <p className="text-white/90 mb-4 text-center">Own this unique story as an NFT and unlock the full content</p>
                    <Button 
                      onClick={handlePurchase}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase for {storyData.price}
                    </Button>
                  </div>
                )}
              </motion.div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="px-3 py-1">{storyData.genre}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {storyData.readTime} read
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-2" />
                    <span>{storyData.likes} likes</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-blue-500 mr-2" />
                    <span>{storyData.views} views</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {storyData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {storyData.isOwned ? storyData.owner.substring(0, 2).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{storyData.isOwned ? "Owned by you" : "Not owned"}</p>
                      <p className="text-xs text-muted-foreground">
                        {storyData.isOwned ? `Since ${storyData.dateCreated}` : `Available for ${storyData.price}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {storyData.isOwned && (
                  <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20">
                    <h3 className="font-semibold flex items-center text-amber-800 dark:text-amber-400">
                      <Gift className="h-4 w-4 mr-2" />
                      You own this NFT
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This story NFT is part of your collection since {storyData.dateCreated}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Story Content */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-2/3"
            >
              <h1 className="text-4xl font-bold gradient-heading mb-3">{storyData.title}</h1>
              
              <div className="flex items-center mb-6">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={storyData.authorAvatar} alt={storyData.author} />
                  <AvatarFallback>{storyData.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{storyData.author}</p>
                  <p className="text-sm text-muted-foreground">
                    Published on {storyData.dateCreated}
                  </p>
                </div>
              </div>
              
              <Tabs defaultValue="story" onValueChange={setActiveTab} className="mb-8">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="story">Story</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="ownership">Ownership</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 max-h-[60vh] overflow-auto">
                  <TabsContent value="story" className="m-0 h-full">
                    <div className="prose dark:prose-invert max-w-none pb-4">
                      {storyData.isOwned ? (
                        <>
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Story Summary</h3>
                            <div className="bg-muted/50 p-4 rounded-lg border">
                              <p className="italic">{storyData.summary}</p>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Full Story</h3>
                            <p className="text-lg">{storyData.fullText}</p>
                          </div>
                          
                          <Button variant="outline" className="mt-4">
                            <Download className="h-4 w-4 mr-2" />
                            Download Full Story
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Story Summary</h3>
                            <div className="bg-muted/50 p-4 rounded-lg border">
                              <p className="italic">{storyData.summary}</p>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Story Excerpt</h3>
                            <div className="bg-muted p-6 rounded-lg border italic">
                              {storyData.excerpt}
                            </div>
                          </div>
                          
                          <div className="text-center p-8 border-t border-dashed">
                            <BookOpen className="h-12 w-12 mx-auto text-amber-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                              Purchase this NFT to unlock the full story
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              Own this unique piece of digital literature and gain exclusive access to the complete content.
                            </p>
                            <Button 
                              onClick={handlePurchase}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Purchase for {storyData.price}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="m-0 h-full">
                    <div className="space-y-6 pb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Story Details</h3>
                        <p className="text-muted-foreground">{storyData.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Word Count</div>
                            <div className="text-xl font-semibold">{storyData.wordCount.toLocaleString()}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Reading Time</div>
                            <div className="text-xl font-semibold">{storyData.readTime}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Genre</div>
                            <div className="text-xl font-semibold">{storyData.genre}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Date Created</div>
                            <div className="text-xl font-semibold">{storyData.dateCreated}</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {storyData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="capitalize">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ownership" className="m-0 h-full">
                    <div className="space-y-6 pb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Ownership Details</h3>
                        <div className="bg-card p-4 rounded-lg border">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar>
                              <AvatarImage src={storyData.authorAvatar} />
                              <AvatarFallback>{storyData.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{storyData.author}</p>
                              <p className="text-sm text-muted-foreground">Creator</p>
                            </div>
                          </div>
                          
                          <div className="border-t border-border pt-4 mt-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={storyData.isOwned ? `https://api.dicebear.com/7.x/micah/svg?seed=${storyData.owner}` : storyData.authorAvatar} />
                                <AvatarFallback>{(storyData.isOwned ? storyData.owner : storyData.author).substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{storyData.isOwned ? storyData.owner : storyData.author}</p>
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
                            <span className="font-medium">#{storyData.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Royalty</span>
                            <span className="font-medium">10%</span>
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
                            <span>Full access to the complete story ({storyData.wordCount.toLocaleString()} words)</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Digital ownership verified on the blockchain</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Direct contact with the author for feedback and discussions</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Ability to resell this NFT on the marketplace</span>
                          </li>
                        </ul>
                      </div>
                      
                      {!storyData.isOwned && (
                        <Button 
                          onClick={handlePurchase}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-2"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase for {storyData.price}
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLike}
                    className="flex items-center"
                  >
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
                
                {!storyData.isOwned && (
                  <Button 
                    onClick={handlePurchase}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Purchase
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Related Stories Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">More Stories Like This</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storyData.relatedStories.map((related) => (
            <Link 
              key={related.id} 
              href={`/nft-marketplace/text-stories/${related.id}`}
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