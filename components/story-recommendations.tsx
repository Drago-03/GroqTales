"use client";

import { useState, useEffect } from "react";
import { useStoryRecommendations } from "@/hooks/use-story-recommendations";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import StoryCard from "@/components/story-card";
import { useToast } from "@/components/ui/use-toast";

interface StoryRecommendationsProps {
  storyId: string;
  content?: string;
  keywords?: string[];
  genre?: string;
  title?: string;
  limit?: number;
  className?: string;
  apiKey?: string;
  onStoryClick?: (story: any) => void;
}

export function StoryRecommendations({
  storyId,
  content,
  keywords,
  genre,
  title = "Recommended Stories",
  limit = 4,
  className,
  apiKey,
  onStoryClick
}: StoryRecommendationsProps) {
  const { getRecommendations, recommendations, isLoading, error } = useStoryRecommendations();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (storyId && !isInitialized) {
      loadRecommendations();
      setIsInitialized(true);
    }
  }, [storyId, isInitialized]);

  const loadRecommendations = async () => {
    try {
      await getRecommendations({
        storyId,
        content,
        keywords,
        genre,
        limit,
        apiKey
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load recommendations",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await loadRecommendations();
    toast({
      title: "Recommendations Refreshed",
      description: "Story recommendations have been updated",
      variant: "default",
    });
  };

  // Map database story to the format expected by StoryCard
  const mapToStoryCardFormat = (story: any) => {
    let author;
    if (typeof story.author === 'object' && story.author) {
      author = story.author.name || story.author.username;
    } else {
      author = story.author || 'Unknown';
    }

    return {
      id: story._id.toString(),
      title: story.title,
      content: story.content,
      author: author,
      authorAvatar: typeof story.author === 'object' ? story.author.avatar : undefined,
      description: story.summary,
      genre: story.genre,
      coverImage: story.coverImage,
      likes: story.likes,
      views: story.views,
    };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          AI-powered story recommendations based on content and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Finding recommendations...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={loadRecommendations}
            >
              Try Again
            </Button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No recommendations found. Try refreshing or changing your content.
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={loadRecommendations}
            >
              Find Recommendations
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((story) => (
              <div key={story._id.toString()} onClick={() => onStoryClick && onStoryClick(story)}>
                <StoryCard
                  story={mapToStoryCardFormat(story)}
                  viewMode="grid"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {recommendations.length > 0 && (
        <CardFooter className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {recommendations.length} stories found
          </span>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 