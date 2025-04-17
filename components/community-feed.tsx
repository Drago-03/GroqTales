"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, MessageSquare, Share2, 
  BookmarkPlus, MoreHorizontal, 
  ArrowUp, ArrowDown, Send, 
  Sparkles, ImageIcon, Link2 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type CommunityPost = {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  comments: number;
  shares: number;
  userVote?: 'up' | 'down' | null;
  tags: string[];
  storyId?: string;
};

const dummyPosts: CommunityPost[] = [
  {
    id: "1",
    author: {
      name: "Elena Martinez",
      username: "ai_storyteller",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      verified: true,
    },
    content: "Just published my first AI-generated sci-fi short story on GroqTales! It explores the boundaries between human consciousness and artificial intelligence. Would love to hear your thoughts! #SciFi #AIWriting",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date(2024, 3, 20),
    upvotes: 124,
    downvotes: 8,
    comments: 32,
    shares: 17,
    tags: ["SciFi", "AIWriting"],
    storyId: "3",
  },
  {
    id: "2",
    author: {
      name: "Jordan Thompson",
      username: "crypto_novelist",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      verified: true,
    },
    content: "I'm amazed by how GroqTales has transformed my storytelling process. The integration of blockchain for ownership verification gives me peace of mind when publishing my work. Has anyone else explored the NFT features? #Web3 #CreativeWriting",
    createdAt: new Date(2024, 3, 19),
    upvotes: 89,
    downvotes: 2,
    comments: 41,
    shares: 12,
    tags: ["Web3", "CreativeWriting"],
  },
  {
    id: "3",
    author: {
      name: "Indie Hub",
      username: "indie_hub",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      verified: true,
    },
    content: "We're excited to announce a new collaboration with GroqTales to support independent storytellers! Our joint initiative will provide resources, mentorship, and exposure for emerging writers using AI tools. Join our upcoming webinar to learn more! #IndieCreators #AIStories",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date(2024, 3, 18),
    upvotes: 357,
    downvotes: 5,
    comments: 84,
    shares: 132,
    tags: ["IndieCreators", "AIStories"],
  },
  {
    id: "4",
    author: {
      name: "Samira Khan",
      username: "fantasy_dreamer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      verified: false,
    },
    content: "Working on a new fantasy series inspired by ancient Persian mythology. GroqTales' genre-specific AI prompts have been incredibly helpful in developing my world-building. Anyone else writing in the fantasy genre want to connect and share tips? #FantasyWriting #Worldbuilding",
    createdAt: new Date(2024, 3, 17),
    upvotes: 76,
    downvotes: 3,
    comments: 29,
    shares: 8,
    tags: ["FantasyWriting", "Worldbuilding"],
  },
  {
    id: "5",
    author: {
      name: "Marcus Wilson",
      username: "tech_wordsmith",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      verified: false,
    },
    content: "Just tokenized my first short story collection as NFTs! It's amazing to see readers collecting and trading my stories. The future of publishing is here, and it's on the blockchain. Check out my profile to see my latest releases. #NFTStories #DigitalPublishing",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date(2024, 3, 16),
    upvotes: 112,
    downvotes: 14,
    comments: 27,
    shares: 19,
    tags: ["NFTStories", "DigitalPublishing"],
    storyId: "5",
  },
];

function PostActions({ post, onVote }: { post: CommunityPost, onVote: (postId: string, vote: 'up' | 'down' | null) => void }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground pt-3 border-t">
      <div className="flex items-center space-x-2">
        <Button
          variant={post.userVote === 'up' ? "default" : "ghost"} 
          size="icon" 
          className={post.userVote === 'up' ? "bg-green-500 text-white hover:bg-green-600" : "hover:text-green-500"}
          onClick={() => onVote(post.id, post.userVote === 'up' ? null : 'up')}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{post.upvotes - post.downvotes}</span>
        <Button 
          variant={post.userVote === 'down' ? "default" : "ghost"} 
          size="icon"
          className={post.userVote === 'down' ? "bg-red-500 text-white hover:bg-red-600" : "hover:text-red-500"}
          onClick={() => onVote(post.id, post.userVote === 'down' ? null : 'down')}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      
      <Button variant="ghost" size="sm" className="flex items-center">
        <MessageSquare className="h-4 w-4 mr-1" />
        <span className="text-xs">{post.comments}</span>
      </Button>
      
      <Button variant="ghost" size="sm" className="flex items-center">
        <Share2 className="h-4 w-4 mr-1" />
        <span className="text-xs">{post.shares}</span>
      </Button>
      
      <Button variant="ghost" size="icon">
        <BookmarkPlus className="h-4 w-4" />
      </Button>
    </div>
  );
}

function PostCard({ post, onVote }: { post: CommunityPost, onVote: (postId: string, vote: 'up' | 'down' | null) => void }) {
  return (
    <Card className="overflow-hidden hover:border-primary/20 transition-all duration-200 bg-gradient-to-br from-background via-background to-background/80">
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <p className="font-semibold">{post.author.name}</p>
              {post.author.verified && (
                <Badge variant="outline" className="ml-1 bg-blue-500/10 border-blue-500/30 text-blue-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span className="text-xs">Verified</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{post.author.username}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Follow @{post.author.username}</DropdownMenuItem>
            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Report content</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-3 space-y-3">
        <p className="text-sm whitespace-pre-line">{post.content}</p>
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <Link href={`/tags/${tag.toLowerCase()}`} key={tag}>
              <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
        {post.image && (
          <div className="relative h-64 w-full rounded-md overflow-hidden mt-2 border border-border">
            <Image 
              src={post.image} 
              alt="Post attachment" 
              fill 
              className="object-cover"
            />
          </div>
        )}
        {post.storyId && (
          <Link href={`/stories/${post.storyId}`}>
            <div className="border rounded-md p-3 flex items-center gap-2 bg-card/50 hover:bg-card">
              <BookmarkPlus className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Read the complete story</span>
            </div>
          </Link>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <PostActions post={post} onVote={onVote} />
      </CardFooter>
    </Card>
  );
}

function CreatePostForm() {
  const [content, setContent] = useState('');

  return (
    <Card className="mb-6 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader className="p-4 pb-0">
        <h3 className="text-lg font-semibold">Share your thoughts</h3>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <Textarea 
          placeholder="What's on your mind?" 
          className="resize-none focus-visible:ring-primary/20 bg-background/50"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <ImageIcon className="h-4 w-4 text-primary" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Link2 className="h-4 w-4 text-primary" />
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90">
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>(dummyPosts);
  
  const handleVote = (postId: string, vote: 'up' | 'down' | null) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        // Update vote counts based on previous vote and new vote
        let upvotes = post.upvotes;
        let downvotes = post.downvotes;
        
        // Remove previous vote
        if (post.userVote === 'up') upvotes--;
        if (post.userVote === 'down') downvotes--;
        
        // Add new vote
        if (vote === 'up') upvotes++;
        if (vote === 'down') downvotes++;
        
        return { ...post, userVote: vote, upvotes, downvotes };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Community Hub</h1>
        <p className="text-muted-foreground">Join the conversation with writers, readers, and storytellers</p>
      </div>
      
      <Tabs defaultValue="trending" className="mb-6">
        <TabsList className="bg-card/30 border w-full">
          <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
          <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <CreatePostForm />
      
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onVote={handleVote} />
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="w-full max-w-xs">
          Load More
        </Button>
      </div>
    </div>
  );
} 