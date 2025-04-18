"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/components/providers/web3-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingAnimation } from "@/components/loading-animation";
import { useToast } from "@/components/ui/use-toast";
import { PenSquare, Image as ImageIcon, Sparkles } from "lucide-react";

export default function CreateStoryPage() {
  const router = useRouter();
  const { account } = useWeb3();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [storyData, setStoryData] = useState({
    title: "",
    description: "",
    genre: "",
    content: "",
    coverImage: null as File | null
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('adminSession');
      
      if (!account && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "Please connect your wallet or login as admin to create stories",
          variant: "destructive",
        });
        router.push('/');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [account, router, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (value: string) => {
    setStoryData(prev => ({
      ...prev,
      genre: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoryData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically:
      // 1. Upload the cover image to IPFS
      // 2. Save the story content to IPFS
      // 3. Create an NFT with the metadata
      // 4. Save the story details to your backend

      toast({
        title: "Story Created!",
        description: "Your story has been successfully created and published.",
      });

      router.push('/stories'); // Redirect to stories page
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: "Error",
        description: "Failed to create story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation message="Loading Story Creator" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full theme-gradient-bg">
                <PenSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Create Your Story</CardTitle>
                <CardDescription>Share your creativity with the world</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Story Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={storyData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your story title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="genre" className="text-sm font-medium">
                  Genre
                </label>
                <Select onValueChange={handleGenreChange} value={storyData.genre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="science-fiction">Science Fiction</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Short Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={storyData.description}
                  onChange={handleInputChange}
                  placeholder="Write a brief description of your story"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Story Content
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={storyData.content}
                  onChange={handleInputChange}
                  placeholder="Write your story here..."
                  className="min-h-[300px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="coverImage" className="text-sm font-medium">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('coverImage')?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {storyData.coverImage && (
                    <span className="text-sm text-muted-foreground">
                      {storyData.coverImage.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="theme-gradient-bg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingAnimation message="Creating Story" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Story
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 