import { useToast } from "@/components/ui/use-toast";

// Types
interface AdminAction {
  type: 'like' | 'dislike' | 'comment' | 'delete' | 'post';
  storyId?: string;
  commentId?: string;
  content?: string;
  timestamp: Date;
}
// Keep track of admin actions for demo purpose
let adminActions: AdminAction[] = [];

/**
 * Check if the current user is logged in as admin

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // Check localStorage (primary method)
    const adminSession = localStorage.getItem('adminSession') === 'true';

    // Also check the cookie (backup method)
    const hasCookie = document.cookie.split(';').some(cookie => {
      return cookie.trim().startsWith('adminSessionActive=true');
    });

    // Return true if either authentication method is valid
    return adminSession || hasCookie;
  } catch (error) {
    // If we can't access localStorage (e.g., incognito mode), check only cookie
    try {
      return document.cookie.split(';').some(cookie => {
        return cookie.trim().startsWith('adminSessionActive=true');
      });
    } catch (e) {
      console.error("Error checking admin authentication:", e);
      return false;
}
}
}
/**
 * Get the admin display name for interactions

export function getAdminDisplayName(): string {
  return "GroqTales";
}
/**
 * Get the admin avatar URL

export function getAdminAvatarUrl(): string {
  // In a real app, this would be a proper logo URL
  // Using a placeholder avatar for now
  return "https://api.dicebear.com/7.x/bottts/svg?seed=GroqTales&backgroundColor=6d28d9";
}
/**
 * Perform an admin action on a story or comment

export async function performAdminAction(action: Omit<AdminAction, 'timestamp'>): Promise<boolean> {
  // In a real app, this would call an API
  try {
    const actionWithTimestamp = {
      ...action,
      timestamp: new Date()
    };

    // Store action for demo purposes
    adminActions.push(actionWithTimestamp);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    return true;
  } catch (error) {
    console.error("Admin action failed:", error);
    return false;
}
}
/**
 * Get the admin's recent actions (for the dashboard)

export function getAdminActions(): AdminAction[] {
  return [...adminActions].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
}
/**
 * Clear admin action history

export function clearAdminActions(): void {
  adminActions = [];
}
/**
 * Hook for admin interactions that provides easy access to admin functionality

export function useAdminInteractions() {
  const { toast } = useToast();

  const likeStory = async (storyId: string) => {
    const success = await performAdminAction({
      type: 'like',
      storyId
    });

    if (success) {
      toast({
        title: "Action successful",
        description: "You liked this story as GroqTales admin"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Could not like this story"
      });
}
    return success;
  };

  const dislikeStory = async (storyId: string) => {
    const success = await performAdminAction({
      type: 'dislike',
      storyId
    });

    if (success) {
      toast({
        title: "Action successful",
        description: "You disliked this story as GroqTales admin"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Could not dislike this story"
      });
}
    return success;
  };

  const commentOnStory = async (storyId: string, content: string) => {
    const success = await performAdminAction({
      type: 'comment',
      storyId,
      content
    });

    if (success) {
      toast({
        title: "Comment added",
        description: "Your admin comment has been added"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Comment failed",
        description: "Could not add your comment"
      });
}
    return success;
  };

  const deleteStory = async (storyId: string) => {
    const success = await performAdminAction({
      type: 'delete',
      storyId
    });

    if (success) {
      toast({
        title: "Story deleted",
        description: "The story has been removed"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete the story"
      });
}
    return success;
  };

  const createPost = async (content: string) => {
    const success = await performAdminAction({
      type: 'post',
      content
    });

    if (success) {
      toast({
        title: "Post created",
        description: "Your admin post has been published"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Post failed",
        description: "Could not create your post"
      });
}
    return success;
  };

  return {
    isAdmin: isAdminLoggedIn(),
    adminName: getAdminDisplayName(),
    adminAvatar: getAdminAvatarUrl(),
    likeStory,
    dislikeStory,
    commentOnStory,
    deleteStory,
    createPost
  };
}