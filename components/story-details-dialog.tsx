import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, MessageSquare, Share2, Wallet } from "lucide-react";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";

interface StoryDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  story: any;
  onPurchase?: () => void;
  onComment?: () => void;
  onLike?: () => void;
}

export function StoryDetailsDialog({
  isOpen,
  onClose,
  story,
  onPurchase,
  onComment,
  onLike,
}: StoryDetailsDialogProps) {
  const { account } = useWeb3();
  const { toast } = useToast();

  const handlePurchase = () => {
    if (!account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      });
      return;
    }
    onPurchase?.();
  };

  // Prevent dialog from closing when clicking inside
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-3xl h-[90vh] flex flex-col overflow-hidden"
        onClick={handleContentClick}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">{story.title}</DialogTitle>
          <DialogDescription>
            By {story.author} • {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4">
          <div className="relative aspect-video w-full mb-6">
            <img
              src={story.coverImage || story.image}
              alt={story.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={story.authorAvatar} />
                  <AvatarFallback>{story.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{story.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    {story.authorUsername || '@' + story.author.toLowerCase().replace(/\s+/g, '')}
                  </p>
                </div>
              </div>
              {story.genre && (
                <Badge variant="secondary">{story.genre}</Badge>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p>{story.description || story.content}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" onClick={onLike}>
                  <Heart className="w-4 h-4 mr-1" />
                  {story.likes || 0}
                </Button>
                <Button variant="ghost" size="sm" onClick={onComment}>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {story.comments?.length || 0}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  <Eye className="w-4 h-4 inline mr-1" />
                  {story.views || 0} views
                </div>
                {story.price && (
                  <Button onClick={handlePurchase} className="theme-gradient-bg">
                    <Wallet className="w-4 h-4 mr-2" />
                    Purchase for {story.price}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogClose className="absolute right-4 top-4" />
      </DialogContent>
    </Dialog>
  );
} 