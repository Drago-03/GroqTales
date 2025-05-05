"use client";

import Link from "next/link";
import { NFTMarketplace } from "@/components/nft-marketplace";
import { PageHeader } from "../components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

// Mock data for NFTs (since we can't import from other pages)
const mockComicNFTs = [
  { id: 1, title: "Epic Adventure", author: "ComicCreator", coverImage: "/images/comic1.jpg", price: "0.05 ETH", description: "An epic comic adventure.", likes: 120, views: 300, pages: 24, genre: "Adventure", rarity: "rare", previewImages: [], isAnimated: false },
  { id: 2, title: "Space Odyssey", author: "SpaceArtist", coverImage: "/images/comic2.jpg", price: "0.08 ETH", description: "A space odyssey in comic form.", likes: 150, views: 400, pages: 30, genre: "Sci-Fi", rarity: "legendary", previewImages: [], isAnimated: true }
];

const allTextNFTs = [
  { id: 1, title: "Mystic Tale", author: "StoryWeaver", coverImage: "/images/story1.jpg", price: "0.03 ETH", description: "A mystical story full of wonder.", likes: 80, views: 200, wordCount: 5000, genre: "Fantasy", tags: ["magic", "adventure"], excerpt: "Once upon a time..." },
  { id: 2, title: "Future Dreams", author: "DreamWriter", coverImage: "/images/story2.jpg", price: "0.04 ETH", description: "A futuristic narrative of dreams.", likes: 100, views: 250, wordCount: 7000, genre: "Sci-Fi", tags: ["future", "tech"], excerpt: "In the year 3025..." }
];

export default function NFTMarketplacePage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState("comic");
  const [coverPage, setCoverPage] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [summary, setSummary] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [uploadedNFTs, setUploadedNFTs] = useState<any[]>([]);

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;
    let error = "";

    if (uploadType === "comic" && !contentFile) {
      isValid = false;
      error = "Please upload a Comic PDF file.";
    } else if (uploadType === "text" && !textContent && !contentFile) {
      isValid = false;
      error = "Please enter story text or upload a text file.";
    }

    if (!summary) {
      isValid = false;
      error = "Please provide a story summary.";
    }

    if (!isValid) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);
    console.log("Uploading", { uploadType, coverPage, contentFile, textContent, summary });
    
    // Add the new upload to the list
    const newNFT = {
      id: uploadedNFTs.length + allNFTs.length + 1,
      title: uploadType === "comic" ? "Uploaded Comic" : "Uploaded Story",
      author: "CurrentUser",
      coverImage: coverPage ? URL.createObjectURL(coverPage) : "/images/default-cover.jpg",
      price: "0.05 ETH",
      description: uploadType === "comic" ? "An uploaded comic adventure." : "An uploaded text story.",
      summary: summary,
      likes: 0,
      views: 0,
      ...(uploadType === "comic" ? { pages: 24, genre: "Adventure", rarity: "common", previewImages: [], isAnimated: false } : { wordCount: 5000, genre: "Fiction", tags: ["user-upload"], excerpt: textContent.slice(0, 50) + "..." })
    };
    setUploadedNFTs([newNFT, ...uploadedNFTs]);
    
    // Show success dialog
    setIsUploadDialogOpen(false);
    setIsSuccessDialogOpen(true);
    
    // Reset form
    setCoverPage(null);
    setContentFile(null);
    setTextContent("");
    setSummary("");
  };

  // Combine comic, text, and uploaded NFTs
  const allNFTs = [...mockComicNFTs, ...allTextNFTs, ...uploadedNFTs];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <PageHeader 
          title="NFT Marketplace"
          description="GroqTales NFT Marketplace"
          icon="shopping-cart"
        />
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2" onClick={() => console.log('Upload button clicked!')}>
              <Upload className="h-4 w-4" />
              Upload Story NFT
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto top-0 translate-y-0 mt-4">
            <DialogHeader>
              <DialogTitle>Upload NFT Story</DialogTitle>
              <DialogDescription>
                Upload your comic or text story to mint as an NFT.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit}>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter story title" required />
                </div>
                
                <div className="space-y-2">
                  <Label>Story Type</Label>
                  <Tabs defaultValue="comic" onValueChange={setUploadType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="comic">Comic Story</TabsTrigger>
                      <TabsTrigger value="text">Text Story</TabsTrigger>
                    </TabsList>
                    <TabsContent value="comic" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="comicUpload">Upload Comic PDF</Label>
                        <Input 
                          id="comicUpload" 
                          type="file" 
                          accept=".pdf" 
                          onChange={(e) => setContentFile(e.target.files?.[0] || null)}
                          required 
                        />
                        <p className="text-xs text-muted-foreground">
                          Your PDF will be converted to slides. Max 20MB.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="text" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="textContent">Story Text</Label>
                        <Textarea 
                          id="textContent" 
                          placeholder="Write your story or paste text here"
                          rows={6}
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Or Upload Text File</Label>
                        <Input 
                          type="file" 
                          accept=".txt,.docx" 
                          onChange={(e) => setContentFile(e.target.files?.[0] || null)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Supported formats: TXT, DOCX. Max 10MB.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary">Story Summary</Label>
                  <Textarea 
                    id="summary" 
                    placeholder="Provide a brief summary of your story (will appear in story details)"
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This summary will be shown in the story details page below the excerpt.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverUpload">Cover Image</Label>
                  <Input 
                    id="coverUpload" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setCoverPage(e.target.files?.[0] || null)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be displayed as your story cover. Recommended size: 800x1200px.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (ETH)</Label>
                  <Input id="price" type="number" step="0.01" min="0.01" placeholder="0.1" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your story"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                {errorMessage && (
                  <div className="text-red-500 mb-4 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errorMessage}
                  </div>
                )}
                <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload & Mint NFT</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>NFT Story Uploaded!</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-semibold">Your story has been successfully uploaded as an NFT!</p>
          </motion.div>
        </DialogContent>
      </Dialog>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-12"
      >
        <Link href="/nft-marketplace/comic-stories">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-xl p-8 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
            <div className="h-12 w-12 bg-purple-500/20 dark:bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-purple-700 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Comic Story NFTs</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Explore visual storytelling through comic NFTs with stunning artwork and engaging narratives.
            </p>
            <Button variant="outline" className="w-full justify-between group">
              Browse Comic Stories
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Link>
        
        <Link href="/nft-marketplace/text-stories">
          <div className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/40 rounded-xl p-8 border border-amber-200 dark:border-amber-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
            <div className="h-12 w-12 bg-amber-500/20 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-amber-700 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Text Story NFTs</h2>
            <p className="text-muted-foreground mb-6 flex-grow">
              Discover written treasures from talented authors across genres in our text-based NFT collection.
            </p>
            <Button variant="outline" className="w-full justify-between group">
              Browse Text Stories
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Link>
      </motion.div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Community Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allNFTs.slice(0, 4).map((nft) => (
            <div key={nft.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = nft.hasOwnProperty('pages') ? `/nft-marketplace/comic-stories/${nft.id}` : `/nft-marketplace/text-stories/${nft.id}`}>
              <div className="relative h-48 bg-muted">
                <Image
                  src={nft.coverImage}
                  alt={nft.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white">
                  <h3 className="font-bold">{nft.title}</h3>
                  <p className="text-sm">by {nft.author}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{nft.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-600">{nft.price}</span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 