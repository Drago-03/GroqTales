"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useWeb3 } from "@/components/providers/web3-provider";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  BookOpen,
  Image as ImageIcon,
  PenSquare,
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  User,
  Wallet,
  Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StoryCommentsDialog } from "@/components/story-comments-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { nanoid } from 'nanoid';
import { isAdminLoggedIn, useAdminInteractions, getAdminAvatarUrl } from "@/lib/admin-service";
import { VerifiedBadge } from "@/components/verified-badge";
import { StoryCard } from "@/components/story-card";
import { StoryDetailsDialog } from "@/components/story-details-dialog";

// Types for our content
interface Story {
  id: string;
  type: 'nft' | 'text' | 'comic' | 'art';
  title: string;
  content: string;
  fullContent: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    address?: string;
    followers: number;
  };
  timestamp: Date;
  likes: number;
  dislikes: number;
  userVote: 'up' | 'down' | null;
  comments: Comment[];
  image?: string;
  isNFT?: boolean;
  price?: string;
  tags: string[];
  commentCount: number;
  shares: number;
}

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
}

// Generate mock data with more human-like content and authors
function generateMockStories(count: number): Story[] {
  const types: ('nft' | 'text' | 'comic' | 'art')[] = ['nft', 'text', 'comic', 'art'];
  const tags = [
    'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Horror',
    'Adventure', 'Comedy', 'Drama', 'Thriller', 'Historical'
  ];
  
  // More realistic author names and content
  const realNames = [
    'Emily Johnson', 'Michael Chen', 'Sarah Williams', 'David Rodriguez', 
    'Olivia Taylor', 'James Wilson', 'Sophia Martinez', 'Benjamin Lee',
    'Ava Thompson', 'Noah Garcia', 'Isabella Brown', 'Liam Davis',
    'Mia Anderson', 'Lucas Smith', 'Charlotte Miller', 'Ethan Jones'
  ];
  
  const storyTitles = [
    'The Last Memory Collector', 'Whispers of the Ancient Forest', 
    'Neon Dreams in the Digital Age', 'The Time Traveler\'s Daughter',
    'Echoes of Tomorrow', 'The Silent Symphony', 'Chronicles of New Earth',
    'Forgotten Realms: The Awakening', 'Midnight in the Garden of Shadows',
    'The Quantum Paradox', 'Tales from the Cosmic Frontier', 'Heartstrings',
    'The Alchemist\'s Legacy', 'Parallel Lives', 'The Missing Constellation',
    'Beneath the Surface'
  ];
  
  const storyContents = [
    'In a world where memories could be bought and sold, one collector discovered a memory so powerful it could change humanity forever...',
    'The ancient forest had stood for millennia, silently watching over the valley. But now it had started whispering secrets only she could hear...',
    'As the neon lights flickered against the rain-soaked streets, Alex knew this night would change everything...',
    'She had always known her mother was different, but discovering she came from the future was just the beginning of the revelations...',
    'The message arrived exactly 50 years after it was sent, and with it came a warning that could save or doom us all...',
    'The music stopped worldwide on the same day, but for Maya, the melodies in her head only grew stronger...',
    'After the Great Migration to New Earth, the colonists discovered they weren\'t the first intelligent life to claim the planet...',
    'The forgotten magic began to return to the world, awakening powers that had been dormant for centuries...',
    'The garden only appeared at midnight, offering visitors glimpses of possible futures if they dared to enter...',
    'When two parallel universes began to merge, only a small group of scientists noticed the subtle changes at first...'
  ];

  const usernames = [
    'cosmic_writer', 'story_weaver', 'word_alchemist', 'tale_spinner',
    'quantum_poet', 'narrative_nomad', 'fiction_forge', 'prose_wanderer',
    'ink_dreamer', 'fable_crafter', 'chapter_chaser', 'verse_voyager',
    'plot_pilot', 'character_creator', 'saga_sculptor', 'epic_enthusiast'
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const randomTags = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      tags[Math.floor(Math.random() * tags.length)]
    );
    
    const authorIndex = Math.floor(Math.random() * realNames.length);
    const titleIndex = Math.floor(Math.random() * storyTitles.length);
    const contentIndex = Math.floor(Math.random() * storyContents.length);
    
    // Create comments first so we can get an accurate count
    const comments = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => {
      const commenterIndex = Math.floor(Math.random() * realNames.length);
      return {
        id: `comment-${i}-${j}`,
        author: {
          name: realNames[commenterIndex],
          username: usernames[commenterIndex],
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${realNames[commenterIndex].replace(' ', '')}`
        },
        content: [
          "This story resonated with me on so many levels! Can't wait to read more of your work.",
          "The way you described the setting made me feel like I was actually there. Brilliant writing!",
          "I never expected that twist at the end. You've got a real talent for storytelling!",
          "As someone who rarely comments, I had to break my silence for this masterpiece. Thank you for sharing your gift.",
          "Your character development is incredible. I felt so connected to the protagonist's journey.",
          "The emotion in this piece is palpable. I actually teared up at the climax.",
          "The themes you explore are so relevant to our current world. This deserves more attention!",
          "I've read this three times now and keep finding new details. Such layered writing!"
        ][Math.floor(Math.random() * 8)],
        timestamp: new Date(Date.now() - Math.random() * 1000000),
        likes: Math.floor(Math.random() * 100)
      }
    });

    return {
      id: `story-${i}`,
      type,
      title: storyTitles[titleIndex],
      content: storyContents[contentIndex],
      fullContent: `${storyContents[contentIndex]}\n\n${Array(5).fill(0).map(() => 
        storyContents[Math.floor(Math.random() * storyContents.length)]).join("\n\n")}`,
      author: {
        name: realNames[authorIndex],
        username: usernames[authorIndex],
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${realNames[authorIndex].replace(' ', '')}`,
        address: `0x${Math.random().toString(16).slice(2, 14)}`,
        followers: Math.floor(Math.random() * 1000)
      },
      timestamp: new Date(Date.now() - Math.random() * 10000000000),
      likes: Math.floor(Math.random() * 1000),
      dislikes: Math.floor(Math.random() * 100),
      userVote: null,
      comments: comments,
      image: type !== 'text' ? `https://picsum.photos/seed/${i}/800/600` : undefined,
      isNFT: type === 'nft',
      price: type === 'nft' ? `${(Math.random() * 2 + 0.1).toFixed(2)} ETH` : undefined,
      tags: randomTags,
      commentCount: comments.length,
      shares: Math.floor(Math.random() * 30)
    };
  });
}

export default function CommunityPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { account, connectWallet } = useWeb3();
  const { toast } = useToast();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [walletPromptAction, setWalletPromptAction] = useState<'vote' | 'comment' | 'follow' | null>(null);
  const [pendingAction, setPendingAction] = useState<{type: string, data: any} | null>(null);
  const [adminNewPost, setAdminNewPost] = useState("");
  const [isAdminPosting, setIsAdminPosting] = useState(false);
  const isAdmin = isAdminLoggedIn();
  const adminInteractions = useAdminInteractions();

  useEffect(() => {
    // Simulate loading stories from an API
    setIsLoading(true);
    setTimeout(() => {
      // Generate mock stories
      const mockStories = generateMockStories(20);
      setStories(mockStories);
      setIsLoading(false);
    }, 1000);
  }, []);

  const requireWalletConnection = (action: 'vote' | 'comment' | 'follow', callback: () => void, data?: any) => {
    if (!account) {
      setWalletPromptAction(action);
      setPendingAction(data ? { type: action, data } : null);
      setShowWalletPrompt(true);
      return false;
    }
    return true;
  };

  const handleConnectAndContinue = async () => {
    try {
      await connectWallet();
      setShowWalletPrompt(false);
      
      // Execute the pending action if the wallet connection was successful
      if (pendingAction && account) {
        switch (pendingAction.type) {
          case 'vote':
            if (pendingAction.data) {
              const { storyId, isUpvote } = pendingAction.data;
              handleVote(storyId, isUpvote);
            }
            break;
          case 'comment':
            if (selectedStory) {
              setShowCommentsDialog(true);
            }
            break;
          case 'follow':
            if (pendingAction.data && pendingAction.data.authorName) {
              handleFollowAuthor(pendingAction.data.authorName);
            }
            break;
        }
        setPendingAction(null);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVote = (storyId: string, isUpvote: boolean) => {
    if (!requireWalletConnection('vote', () => {}, { storyId, isUpvote })) {
      return;
    }

    // Find the current story and its vote status
    const storyToUpdate = stories.find(story => story.id === storyId);
    if (!storyToUpdate) {
      console.error(`Story with ID ${storyId} not found`);
      return;
    }

    // Debug information
    console.log('Vote debug info:', { 
      storyId, 
      isUpvote, 
      currentLikes: storyToUpdate.likes,
      currentDislikes: storyToUpdate.dislikes,
      currentVote: storyToUpdate.userVote
    });

    const currentVote = storyToUpdate.userVote;
    let newVote: 'up' | 'down' | null;
    let newLikes = storyToUpdate.likes;
    let newDislikes = storyToUpdate.dislikes;
    
    // Determine new vote state and adjust counts
    if (isUpvote) {
      if (currentVote === 'up') {
        // Remove upvote
        newVote = null;
        newLikes--;
      } else if (currentVote === 'down') {
        // Switch from downvote to upvote
        newVote = 'up';
        newLikes++;
        newDislikes--;
      } else {
        // New upvote
        newVote = 'up';
        newLikes++;
      }
    } else {
      if (currentVote === 'down') {
        // Remove downvote
        newVote = null;
        newDislikes--;
      } else if (currentVote === 'up') {
        // Switch from upvote to downvote
        newVote = 'down';
        newLikes--;
        newDislikes++;
      } else {
        // New downvote
        newVote = 'down';
        newDislikes++;
      }
    }
    
    // Update stories with new vote counts
    setStories(prevStories => 
      prevStories.map(story => {
        if (story.id === storyId) {
          return {
            ...story,
            likes: newLikes,
            dislikes: newDislikes,
            userVote: newVote
          };
        }
        return story;
      })
    );

    // Also update the selected story if it's the one being voted on
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory({
        ...selectedStory,
        likes: newLikes,
        dislikes: newDislikes,
        userVote: newVote
      });
    }

    toast({
      title: "Vote Recorded",
      description: `Successfully ${newVote === 'up' ? 'upvoted' : newVote === 'down' ? 'downvoted' : 'removed vote from'} the story`
    });
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setShowDetailsDialog(true);
  };

  const handleFollowAuthor = (authorName: string) => {
    if (!requireWalletConnection('follow', () => {}, { authorName })) {
      return;
    }

    setIsFollowing(prev => ({
      ...prev,
      [authorName]: !prev[authorName]
    }));

    toast({
      title: isFollowing[authorName] ? "Unfollowed" : "Following",
      description: isFollowing[authorName] 
        ? `You have unfollowed ${authorName}`
        : `You are now following ${authorName}`
    });
  };

  const handleComment = () => {
    if (!selectedStory) return;
    setShowDetailsDialog(false);
    setShowCommentsDialog(true);
  };

  const handleAddComment = (content: string) => {
    if (!account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to comment",
        variant: "destructive",
      });
      return;
    }

    if (!content) return;

    // Format the new comment
    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        name: account.slice(0, 6) + '...' + account.slice(-4),
        username: account.toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${account}`
      },
      content,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    // Update the selected story's comments
    if (selectedStory) {
      const updatedStory = {
        ...selectedStory,
        comments: [...(selectedStory.comments || []), newComment]
      };
      setSelectedStory(updatedStory);
    }

    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully",
    });
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

  const filteredAndSortedStories = () => {
    let filtered = stories;
    
    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(story => story.type === selectedType);
    }

    // Sort based on active tab
    switch (activeTab) {
      case "trending":
        return filtered.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
      case "latest":
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      case "top":
        return filtered.sort((a, b) => b.likes - a.likes);
      default:
        return filtered;
    }
  };

  // Add admin post to the stories
  const handleAdminPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPost.trim()) return;
    
    setIsAdminPosting(true);
    try {
      // Call the admin service to track the action
      await adminInteractions.createPost(adminNewPost);
      
      // Add the post to the local stories state
      const newStory: Story = {
        id: `admin-story-${nanoid()}`,
        type: 'text',
        title: '',
        content: adminNewPost,
        fullContent: adminNewPost,
        author: {
          name: 'GroqTales',
          username: 'groqtales',
          avatar: getAdminAvatarUrl(),
          followers: 0
        },
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
        userVote: null,
        comments: [],
        tags: ['Official', 'Announcement'],
        commentCount: 0,
        shares: 0
      };
      
      setStories(prev => [newStory, ...prev]);
      setAdminNewPost("");
      
      toast({
        title: "Post published",
        description: "Your admin post has been published to the community"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to post",
        description: "Something went wrong. Please try again."
      });
    } finally {
      setIsAdminPosting(false);
    }
  };
  
  // Admin can delete any story
  const handleAdminDeleteStory = async (storyId: string) => {
    try {
      await adminInteractions.deleteStory(storyId);
      
      // Remove the story from local state
      setStories(prev => prev.filter(story => story.id !== storyId));
      
      toast({
        title: "Story deleted",
        description: "The story has been removed from the community"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete the story"
      });
    }
  };
  
  // Override for admin voting
  const handleAdminVote = async (storyId: string, isUpvote: boolean) => {
    try {
      if (isUpvote) {
        await adminInteractions.likeStory(storyId);
      } else {
        await adminInteractions.dislikeStory(storyId);
      }
      
      // Update local state
      setStories(prev => prev.map(story => {
        if (story.id === storyId) {
          const prevVote = story.userVote;
          
          let newLikes = story.likes;
          let newDislikes = story.dislikes;
          
          // Reset previous vote if any
          if (prevVote === 'up') newLikes--;
          if (prevVote === 'down') newDislikes--;
          
          // Apply new vote
          if (isUpvote) newLikes++;
          else newDislikes++;
          
          return {
            ...story,
            likes: newLikes,
            dislikes: newDislikes,
            userVote: isUpvote ? 'up' : 'down'
          };
        }
        return story;
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Vote failed",
        description: "Could not register your vote"
      });
    }
  };
  
  // Admin comment function
  const handleAdminComment = async (storyId: string, content: string) => {
    try {
      await adminInteractions.commentOnStory(storyId, content);
      
      // Update local state
      setStories(prev => prev.map(story => {
        if (story.id === storyId) {
          const newComment: Comment = {
            id: `admin-comment-${nanoid()}`,
            author: {
              name: 'GroqTales',
              username: 'groqtales',
              avatar: getAdminAvatarUrl()
            },
            content,
            timestamp: new Date(),
            likes: 0
          };
          
          return {
            ...story,
            comments: [...story.comments, newComment],
            commentCount: story.commentCount + 1
          };
        }
        return story;
      }));
      
      toast({
        title: "Comment added",
        description: "Your admin comment has been posted"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Comment failed",
        description: "Could not post your comment"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Community Stories</h1>
          <p className="text-muted-foreground">
            Discover and engage with stories from our community
          </p>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Search stories..."
            className="w-[200px]"
          />
          <Button className="theme-gradient-bg">
            Share Your Story
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedStories().map((story) => (
          <div key={story.id} onClick={() => handleStoryClick(story)}>
            <StoryCard story={story} />
          </div>
        ))}
      </div>

      {selectedStory && (
        <>
          <StoryDetailsDialog
            isOpen={showDetailsDialog}
            onClose={() => setShowDetailsDialog(false)}
            story={selectedStory}
            onComment={handleComment}
            onLike={handleLike}
          />

          <StoryCommentsDialog
            isOpen={showCommentsDialog}
            onClose={() => setShowCommentsDialog(false)}
            storyTitle={selectedStory.title}
            comments={selectedStory.comments || []}
            onAddComment={handleAddComment}
            isWalletConnected={!!account}
          />
        </>
      )}
    </div>
  );
} 