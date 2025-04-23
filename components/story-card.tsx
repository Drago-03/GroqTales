"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, Sparkles, PenSquare, ArrowUpRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface StoryAuthor {
  name: string;
  avatar?: string;
  username?: string;
}

interface Story {
  id: string;
  title: string;
  content?: string;
  author: string | StoryAuthor;
  authorAvatar?: string;
  authorUsername?: string;
  likes?: number;
  views?: number;
  comments?: number;
  coverImage?: string;
  image?: string;
  description?: string;
  price?: string;
  isTop10?: boolean;
  genre?: string;
}

interface StoryCardProps {
  story: Story;
  viewMode?: "grid" | "list";
  hideLink?: boolean;
  showCreateButton?: boolean;
}

export function StoryCard({ story, viewMode = "grid", hideLink = false, showCreateButton = false }: StoryCardProps) {
  const router = useRouter();
  const isGrid = viewMode === "grid";
  
  // Handle different author data structures
  const authorName = typeof story.author === 'string' 
    ? story.author 
    : story.author?.name;
  
  const authorAvatar = typeof story.author === 'string'
    ? story.authorAvatar || '/avatars/default.png'
    : story.author?.avatar || '/avatars/default.png';
    
  const imageUrl = story.coverImage || story.image || '/covers/default.jpg';
  const storyContent = story.description || story.content || '';
  
  const handleCreateSimilar = () => {
    // Direct navigation with URL parameters
    const genre = story.genre || 'fantasy';
    window.location.href = `/create/ai-story?source=card&genre=${encodeURIComponent(genre)}&format=nft`;
  };
  
  const handleViewNFT = () => {
    // Navigate to story detail page
    router.push(`/stories/${story.id}`);
  };
  
  // Create the card content
  const cardContent = (
    <>
      <div className={isGrid ? "relative pt-[60%]" : "relative w-48 min-w-48"}>
        <img
          src={imageUrl}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {story.price && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
            {story.price}
          </div>
        )}
        {story.isTop10 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Top 10
          </div>
        )}
        
        {/* View NFT Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center"
            onClick={handleViewNFT}
          >
            View NFT <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </motion.button>
        </div>
      </div>
      <div className="flex-1">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback>{authorName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{authorName}</p>
          </div>
          <h3 className="text-lg font-semibold mt-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">{story.title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground text-sm line-clamp-2">{storyContent}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Heart className="h-3.5 w-3.5 mr-1" />
              {story.likes || 0}
            </div>
            {story.views && (
              <div className="flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1" />
                {story.views}
              </div>
            )}
            {story.comments !== undefined && (
              <div className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {story.comments}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {story.genre && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {story.genre}
              </span>
            )}
            {showCreateButton && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                title="Create Similar Story"
                onClick={handleCreateSimilar}
              >
                <PenSquare className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardFooter>
      </div>
    </>
  );
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md group",
        isGrid ? "h-full" : "flex gap-4"
      )}>
        {hideLink ? (
          <div className="block">{cardContent}</div>
        ) : (
          <div className="block cursor-pointer" onClick={handleViewNFT}>{cardContent}</div>
        )}
      </Card>
    </motion.div>
  );
}

// Default export for backward compatibility
export default StoryCard;