"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AIStoryGenerator } from "@/components/ai-story-generator";
import { Sparkles, BookText, Wallet, NetworkIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AIStoryGeneratorPage() {
  return (
    <Suspense fallback={<div>Loading AI story page...</div>}>
      <AIStoryContent />
    </Suspense>
  );
}

function AIStoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [navigatedFrom, setNavigatedFrom] = useState<string | null>(null);
  
  // Get parameters from URL
  const source = searchParams.get('source');
  const genre = searchParams.get('genre') || 'fantasy';
  const format = searchParams.get('format') || 'free';
  
  // Create story creation data from URL parameters
  useEffect(() => {
    try {
      console.log("Setting up storyCreationData from URL parameters");
      
      // Create data from URL parameters
      const storyData = {
        type: 'ai',
        format: format,
        genre: genre,
        redirectToCreate: !!source, // Set true if source exists
        timestamp: new Date().getTime()
      };
      
      console.log("Created storyCreationData from URL params:", storyData);
      localStorage.setItem('storyCreationData', JSON.stringify(storyData));
      
    } catch (error) {
      console.error('Error setting up story creation data:', error);
      // Create fresh data with default values on error
      const defaultData = {
        type: 'ai',
        format: 'free',
        genre: 'fantasy',
        redirectToCreate: true,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('storyCreationData', JSON.stringify(defaultData));
    }
  }, [source, genre, format]);

  // Enhanced navigation detection from URL parameters
  useEffect(() => {
    // This function runs when the component mounts to detect navigation source
    const detectNavigationSource = () => {
      // Check URL parameters for source
      if (source) {
        console.log("Navigation source from URL:", source);
        
        // Set the navigation source for customized welcome
        if (source === 'story') {
          setNavigatedFrom('story');
          
          toast({
            title: "Inspired to create your own story?",
            description: "Now you can craft your unique story with our AI tools!",
          });
        } else if (source === 'stories' || source === 'stories_page' || source === 'stories_cta') {
          setNavigatedFrom('stories');
          
          toast({
            title: "Ready to join our storytellers?",
            description: "Create your own unique story with AI assistance.",
          });
        } else if (source === 'trending' || source === 'card') {
          setNavigatedFrom('trending');
          
          toast({
            title: "Create your own amazing story!",
            description: `Start crafting your ${genre} masterpiece now.`,
          });
        } else {
          setNavigatedFrom('homepage');
          
          toast({
            title: "Let's create something amazing!",
            description: "Fill out the story details below to get started.",
          });
        }
      } else {
        // Direct navigation (typed URL or bookmark)
        setNavigatedFrom('direct');
      }
    };
    
    // Run once on mount
    detectNavigationSource();
  }, [toast, source, genre]); // Add dependencies

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center"
            onClick={() => {
              if (navigatedFrom === 'story') {
                router.back(); // Go back to the previous page
              } else if (navigatedFrom === 'stories' || source?.includes('stories')) {
                router.push('/stories');
              } else {
                router.push('/');
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {navigatedFrom === 'story' ? 'Story' : 
                     navigatedFrom === 'stories' || source?.includes('stories') ? 'Stories' : 
                     'Home'}
          </Button>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 gradient-heading">AI Story Creator</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate unique stories using Groq's powerful language models and mint them as NFTs on the Monad blockchain
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium">Generate</h3>
              <p className="text-sm text-muted-foreground">Create AI stories with Groq</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-2">
                <BookText className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium">Customize</h3>
              <p className="text-sm text-muted-foreground">Edit and refine your story</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-2">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium">Mint</h3>
              <p className="text-sm text-muted-foreground">Create NFTs on Monad blockchain</p>
            </div>
          </div>
        </div>
        
        <AIStoryGenerator initialGenre={genre} initialFormat={format} showWelcome={!!source} />
        
        <div className="mt-12 p-6 border rounded-xl bg-muted/30">
          <h2 className="text-xl font-semibold mb-4">About This Feature</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The AI Story Generator uses Groq's advanced language models to create unique stories based on your prompts. 
              These stories can be immediately minted as NFTs on the Monad blockchain, creating provable ownership 
              and authenticity.
            </p>
            <p>
              <strong>How it works:</strong> Enter a prompt, select your preferred AI model and settings, and generate 
              a story. You can then mint this story as an NFT directly from the interface, creating a permanent record 
              of your creation on the blockchain.
            </p>
            <p>
              <strong>Note:</strong> To mint NFTs, you'll need to connect a compatible Web3 wallet and ensure it's 
              configured for the Monad network.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 