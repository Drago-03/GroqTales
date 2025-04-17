"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  image?: string;
}

interface StoryCardProps {
  story: Story;
  viewMode: "grid" | "list";
}

export function StoryCard({ story, viewMode }: StoryCardProps) {
  const isGrid = viewMode === "grid";

  return (
    <Card className={isGrid ? "" : "flex gap-4"}>
      {story.image && (
        <div className={isGrid ? "relative pt-[60%]" : "relative w-48"}>
          <img
            src={story.image}
            alt={story.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
        </div>
      )}
      <div className="flex-1">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={story.author.avatar} />
              <AvatarFallback>{story.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{story.author.name}</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
          <p className="text-muted-foreground">{story.content}</p>
        </CardContent>
        <CardFooter>
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              {story.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              {story.comments}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}