"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, Send, Wallet } from "lucide-react";
import { useWeb3 } from "@/components/providers/web3-provider";
import { VerifiedBadge } from "@/components/verified-badge";

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: Date | string;
  likes: number;
}

interface StoryCommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  isWalletConnected?: boolean;
  isAdmin?: boolean;
}

export function StoryCommentsDialog({
  isOpen,
  onClose,
  storyTitle,
  comments,
  onAddComment,
  onLikeComment,
  isWalletConnected = false,
  isAdmin = false
}: StoryCommentsDialogProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleConnectWallet = () => {
    // Pass empty string to indicate we want to connect wallet, not add a comment
    onAddComment("");
  };

  // Prevent dialog from closing when clicking inside
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl h-[80vh] flex flex-col overflow-hidden"
        onClick={handleContentClick}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            Join the discussion about "{storyTitle}"
          </DialogDescription>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto py-4">
          {comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-muted/30">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{comment.author.name}</p>
                          {comment.author.name === "GroqTales" && (
                            <VerifiedBadge className="ml-1" size="sm" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          @{comment.author.username} • {formatTimestamp(comment.timestamp)}
                        </p>
                      </div>
                      {onLikeComment && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => isWalletConnected ? onLikeComment(comment.id) : handleConnectWallet()}
                          className="text-muted-foreground hover:text-primary"
                          disabled={!isWalletConnected}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {comment.likes}
                        </Button>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        {isWalletConnected ? (
          <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t flex-shrink-0">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isAdmin ? "Write a comment as GroqTales admin..." : "Write a comment..."}
              className={`flex-1 ${isAdmin ? "border-purple-200" : ""}`}
            />
            <Button 
              type="submit" 
              disabled={!newComment.trim()}
              className={isAdmin ? "theme-gradient-bg" : ""}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <div className="text-center border-t pt-4 flex-shrink-0">
            <p className="text-muted-foreground mb-4">
              Connect your wallet to join the conversation
            </p>
            <Button 
              onClick={handleConnectWallet} 
              className="theme-gradient-bg text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        )}

        <DialogClose className="absolute right-4 top-4" />
      </DialogContent>
    </Dialog>
  );
} 