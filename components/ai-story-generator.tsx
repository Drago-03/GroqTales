"use client";

import { useState, useEffect } from "react";
import { useGroq } from "@/hooks/use-groq";
import { useMonad } from "@/hooks/use-monad";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, BookText, CopyCheck, Wallet, Key, Zap, Stars } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { genres } from "@/components/genre-selector";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function AnimatedSparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div 
          key={i}
          className="absolute"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: i * 0.5
          }}
        >
          <Sparkles 
            className="h-3 w-3 text-primary/80" 
            style={{ 
              filter: "drop-shadow(0 0 2px rgba(var(--primary), 0.5))"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function LoadingStateIndicator({ message }: { message: string | null }) {
  const messages = ["Generating story", "Creating worlds", "Crafting characters", "Building plot", "Finalizing details"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="rounded-lg p-6 bg-gradient-to-r from-primary/10 to-blue-500/10 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedSparkles />
      
      <div className="flex items-center justify-center mb-4">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-md"></div>
          <Sparkles className="h-10 w-10 text-primary relative z-10" />
        </motion.div>
      </div>
      
      <motion.h3 
        className="text-lg font-medium text-center mb-2"
        animate={{ opacity: [0.7, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        {message || messages[currentIndex]}
      </motion.h3>
      
      <motion.p
        className="text-sm text-muted-foreground text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Crafting a unique story tailored to your request...
      </motion.p>
      
      <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary via-blue-400 to-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </motion.div>
  );
}

export function AIStoryGenerator({ 
  initialGenre = 'fantasy', 
  initialFormat = 'free',
  showWelcome = false
}: { 
  initialGenre?: string; 
  initialFormat?: string; 
  showWelcome?: boolean;
}) {
  const { generate, generateIdeas, availableModels, defaultModel, isLoading: isGroqLoading, error: groqError, fetchModels } = useGroq();
  const { mintNFT, generateAndMint, isLoading: isMonadLoading, networkInfo, error: monadError, isOnMonadNetwork, switchToMonadNetwork } = useMonad();
  const { account } = useWeb3();
  const { toast } = useToast();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([initialGenre]);
  const [overview, setOverview] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNftUrl, setMintedNftUrl] = useState("");
  const [storyFormat, setStoryFormat] = useState(initialFormat);

  // Story outline fields
  const [mainCharacters, setMainCharacters] = useState("");
  const [plotOutline, setPlotOutline] = useState("");
  const [setting, setSetting] = useState("");
  const [themes, setThemes] = useState("");
  const [userApiKey, setUserApiKey] = useState("");
  const [isUsingCustomKey, setIsUsingCustomKey] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);

  // Add this state variable near the other state declarations
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(showWelcome);

  // Fetch available models on component mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Set default model when available
  useEffect(() => {
    if (defaultModel) {
      setSelectedModel(defaultModel);
    }
  }, [defaultModel]);

  // Remove the old useEffect for localStorage and replace with URL parameter check
  useEffect(() => {
    // Check URL parameters for navigation source
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    const format = urlParams.get('format');
    
    // If user came from homepage or another source that sets this parameter
    if (source === 'home') {
      setShowWelcomeAnimation(true);
      
      // Auto-select format if provided in URL parameters
      if (format === 'nft') {
        setStoryFormat('nft');
      } else if (format === 'free') {
        setStoryFormat('free');
      }
      
      // Clear welcome animation after delay
      const timer = setTimeout(() => {
        setShowWelcomeAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // useEffect to handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isGroqLoading) {
        // Refresh models when user returns to the page
        fetchModels();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isGroqLoading, fetchModels]);

  // Show errors as toasts
  useEffect(() => {
    if (groqError) {
      toast({
        title: "Groq Error",
        description: groqError,
        variant: "destructive",
      });
    }
  }, [groqError, toast]);

  useEffect(() => {
    if (monadError) {
      toast({
        title: "Monad Error",
        description: monadError,
        variant: "destructive",
      });
    }
  }, [monadError, toast]);

  // Constructs a well-engineered prompt based on user inputs
  const constructPrompt = () => {
    // Base prompt template with clear instructions for the AI
    let engineeredPrompt = `
# Creative Writing Task: Generate a Compelling Story

## Story Parameters
- Title: ${title || "[Generate an appropriate title]"}
- Genres: ${selectedGenres.map(g => g.replace(/-/g, ' ')).join(", ")}
- Overview: ${overview || "[No overview provided]"}

## Story Elements
`;

    // Add character details if provided
    if (mainCharacters.trim()) {
      engineeredPrompt += `
### Characters
${mainCharacters}

`;
    }

    // Add setting details if provided
    if (setting.trim()) {
      engineeredPrompt += `
### Setting
${setting}

`;
    }

    // Add plot outline if provided
    if (plotOutline.trim()) {
      engineeredPrompt += `
### Plot Outline
${plotOutline}

`;
    }

    // Add themes if provided
    if (themes.trim()) {
      engineeredPrompt += `
### Themes to Explore
${themes}

`;
    }

    // Add user's specific prompt/request if provided
    if (prompt.trim()) {
      engineeredPrompt += `
### Additional Details
${prompt}

`;
    }

    // Add specific instructions about formatting and structure
    engineeredPrompt += `
## Output Format
- Begin with a captivating title if one wasn't provided
- Structure the story with clear sections and paragraphs
- Include rich descriptions and vivid dialogue
- Develop characters with depth and motivation
- Maintain an engaging narrative arc with beginning, middle, and conclusion
- Aim for a cohesive story of approximately 1000-1500 words

Please generate this story with attention to quality, creativity, and narrative coherence.
`;

    return engineeredPrompt;
  };

  // Handle generating a story with Groq
  const handleGenerate = async () => {
    // At minimum, we need a genre or prompt
    if (!prompt && !plotOutline && !mainCharacters && !setting) {
      toast({
        title: "Input Required",
        description: "Please provide at least a brief story idea or outline",
        variant: "destructive",
      });
      return;
    }

    try {
      const engineeredPrompt = constructPrompt();
      
      // Set systemPrompt to guide the AI's role
      const systemPrompt = "You are an expert creative writer with a talent for crafting engaging, original stories with rich characters, vivid settings, and compelling plots. Your task is to generate a high-quality story based on the provided parameters. Be creative, coherent, and produce publication-quality writing.";
      
      let options = { 
        temperature, 
        system_prompt: systemPrompt,
        max_tokens: 2500
      };
      
      // Check if using custom API key
      let customOptions = {};
      
      if (isUsingCustomKey && userApiKey) {
        customOptions = {
          ...options,
          apiKey: userApiKey
        };
      } else {
        // Make sure to use the environment variable API key
        const envApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
        if (!envApiKey) {
          console.warn("No Groq API key found in environment variables");
        }
      }
      
      // Show a progress toast
      toast({
        title: "Generating Story",
        description: "Please wait while we craft your story with Groq AI...",
      });
      
      // Log request details for debugging (without API key)
      console.log("Generating story with:", { 
        model: selectedModel, 
        prompt: "Content length: " + engineeredPrompt.length,
        temperature
      });
      
      // Call the generate function with the appropriate options
      const content = await generate(engineeredPrompt, selectedModel, 
        isUsingCustomKey && userApiKey ? customOptions : options);
      
      if (!content || content.trim() === '') {
        throw new Error("Empty response received from Groq API. Please try again.");
      }
      
      // Set the generated content and cancel any progress toast
      setGeneratedContent(content);
      
      // Success toast
      toast({
        title: "Story Generated",
        description: "Your AI story has been created successfully!",
      });
      
    } catch (error: any) {
      console.error('Error generating story:', error);
      
      // Show a specific error message based on the error type
      let errorMessage = "Failed to generate story. Please try again.";
      
      if (error.message && error.message.includes("API key")) {
        errorMessage = "Invalid or missing Groq API key. Please check your API key or provide a custom key.";
      } else if (error.message && error.message.includes("timeout")) {
        errorMessage = "Request timed out. The story generation is taking longer than expected. Please try again.";
      } else if (error.message && error.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle generating a story and minting it as an NFT in one step
  const handleGenerateAndMint = async () => {
    // Validate wallet connection for NFT minting
    if (storyFormat === 'nft' && !account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint stories as NFTs",
        variant: "destructive",
      });
      return;
    }

    // At minimum, we need a genre or prompt
    if (!prompt && !plotOutline && !mainCharacters && !setting) {
      toast({
        title: "Input Required",
        description: "Please provide at least a brief story idea or outline",
        variant: "destructive",
      });
      return;
    }

    try {
      const engineeredPrompt = constructPrompt();
      
      // Show a progress toast
      toast({
        title: `Generating${storyFormat === 'nft' ? ' and Minting' : ' and Publishing'}`,
        description: "Please wait while we process your request...",
      });

      // Prepare options for generation and minting
      let apiKeyToUse = undefined;
      if (isUsingCustomKey && userApiKey) {
        apiKeyToUse = userApiKey;
      }

      // For NFT minting
      if (storyFormat === 'nft') {
        if (!account) {
          throw new Error("Wallet connection required for NFT minting");
        }
        
        if (!isOnMonadNetwork) {
          throw new Error("Please switch to the Monad network to mint NFTs");
        }
        
        // Call generate and mint
        const result = await generateAndMint(
          engineeredPrompt,
          title,
          selectedGenres.join(", "),
          { apiKey: apiKeyToUse }
        );
        
        if (!result) {
          throw new Error("Failed to generate and mint NFT");
        }
        
        // Set generated content and minted NFT URL
        setGeneratedContent(result.metadata.content);
        setMintedNftUrl(`/nft-gallery/${result.tokenId}`);
        setActiveTab("mint");
        
        toast({
          title: "NFT Minted Successfully",
          description: `Your story "${result.metadata.title}" has been minted as NFT #${result.tokenId}`,
        });
      } 
      // For free story publishing
      else {
        // Just generate the story
        const content = await generate(
          engineeredPrompt,
          selectedModel,
          { 
            temperature, 
            system_prompt: "You are an expert creative writer with a talent for crafting engaging stories.",
            max_tokens: 2500,
            apiKey: apiKeyToUse
          }
        );
        
        if (!content || content.trim() === '') {
          throw new Error("Empty response received from Groq API");
        }
        
        // Set generated content
        setGeneratedContent(content);
        
        // Simulate publishing (in a real app, you would save to database here)
        setTimeout(() => {
          // Create a mock URL for the published story
          const mockStoryId = `story-${Date.now().toString(36)}`;
          setMintedNftUrl(`/stories/${mockStoryId}`);
          setActiveTab("mint");
          
          toast({
            title: "Story Published Successfully",
            description: "Your story has been published and is now available to readers",
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error in generate and mint:", error);
      
      // Determine appropriate error message
      let errorMessage = "Failed to process your request. Please try again.";
      
      if (error.message && error.message.includes("API key")) {
        errorMessage = "Invalid or missing Groq API key. Please check your API key.";
      } else if (error.message && error.message.includes("wallet")) {
        errorMessage = "Wallet connection issue. Please reconnect your wallet and try again.";
      } else if (error.message && error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection to the Monad network.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Process Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle minting the generated story as an NFT
  const handleMintNFT = async () => {
    if (!generatedContent) {
      toast({
        title: "No Content",
        description: "Please generate a story first",
        variant: "destructive",
      });
      return;
    }

    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    try { 
      setIsMinting(true);
      
      const storyTitle = title || "Untitled AI Story";
      const excerpt = generatedContent.substring(0, 150) + "...";
      
      const metadata = {
        title: storyTitle,
        description: excerpt,
        content: generatedContent,
        excerpt,
        author: "AI Generated",
        authorAddress: account,
        coverImage: `https://source.unsplash.com/random/800x600/?${selectedGenres.join(", ")}`,
        genre: selectedGenres.join(", "),
        createdAt: new Date().toISOString(),
        aiModel: selectedModel,
        aiPrompt: constructPrompt(),
        tags: selectedGenres
      };
      
      const result = await mintNFT(metadata);
      
      if (result) {
        setMintedNftUrl(`/nft/${result.tokenId}`);
        
        toast({
          title: "NFT Minted Successfully",
          description: `Your story has been minted as NFT #${result.tokenId}`,
        });
      }
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Mint Failed",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const isLoading = isGroqLoading || isMonadLoading || isMinting;

  // Add this welcome animation component
  const WelcomeAnimation = () => {
    // Local state to ensure animation completes
    const [animating, setAnimating] = useState(true);
    
    // Use useEffect to control animation timing
    useEffect(() => {
      if (!showWelcomeAnimation) return;
      
      // Start animation
      setAnimating(true);
      
      // Set timer to end animation
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 2800); // Slightly less than the parent timeout
      
      return () => clearTimeout(timer);
    }, [showWelcomeAnimation]);
    
    if (!showWelcomeAnimation || !animating) return null;
    
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-background/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center p-8 bg-card/80 rounded-xl shadow-lg border border-primary/20"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 1.5, times: [0, 0.4, 0.8, 1] }}
            className="mx-auto mb-4"
          >
            <Sparkles className="h-20 w-20 text-primary" />
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold mb-2"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Let's Create Your Story!
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-4"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Fill in the details below to begin your creative journey
          </motion.p>
          <motion.div
            className="w-12 h-1 bg-primary mx-auto rounded-full"
            animate={{ width: [0, 100, 0] }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <WelcomeAnimation />
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Story Generator
          </CardTitle>
          <CardDescription>
            Generate stories with Groq AI and mint them as NFTs on Monad blockchain
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Story</TabsTrigger>
              <TabsTrigger value="mint">{storyFormat === 'nft' ? 'Mint as NFT' : 'Publish Story'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4 mt-4">
              <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950/40 mb-4">
                <h3 className="text-sm font-semibold mb-1 flex items-center">
                  <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                  Create a High-Quality AI Story
                </h3>
                <p className="text-xs text-muted-foreground">
                  Fill out the sections below to provide details for your story. The more information you provide, the better the AI can craft a quality story tailored to your vision.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Story Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Enter a title or leave blank for AI to generate one"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overview">Story Overview</Label>
                <Textarea
                  id="overview"
                  placeholder="Enter a brief overview or summary of your story"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Genres (Select one or more)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((g) => (
                    <label key={g.slug} className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        checked={selectedGenres.includes(g.slug)}
                        onChange={(e) => {
                          if(e.target.checked) {
                            setSelectedGenres(prev => [...prev, g.slug]);
                          } else {
                            setSelectedGenres(prev => prev.filter(s => s !== g.slug));
                          }
                        }}
                      />
                      <span>{g.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/10 space-y-4">
                <h3 className="font-medium text-sm">Story Outline</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="characters">
                    Main Characters
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-2 cursor-help">ⓘ</TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80 text-xs">Describe the main characters of your story: their names, personalities, goals, and relationships.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Textarea
                    id="characters"
                    placeholder="Describe the main characters of your story (e.g., names, personalities, motivations, relationships)"
                    className="min-h-20"
                    value={mainCharacters}
                    onChange={(e) => setMainCharacters(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setting">
                    World & Setting
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-2 cursor-help">ⓘ</TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80 text-xs">Describe the world, time period, and locations where your story takes place.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Textarea
                    id="setting"
                    placeholder="Describe the world, time period, and locations where your story takes place"
                    className="min-h-20"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plot">
                    Plot Outline
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-2 cursor-help">ⓘ</TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80 text-xs">Describe the main events, conflicts, and resolution of your story.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Textarea
                    id="plot"
                    placeholder="Describe the main events, conflicts, and resolution of your story"
                    className="min-h-20"
                    value={plotOutline}
                    onChange={(e) => setPlotOutline(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="themes">
                    Themes & Motifs
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="ml-2 cursor-help">ⓘ</TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80 text-xs">Describe key themes, motifs, or messages you want the story to explore.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Textarea
                    id="themes"
                    placeholder="Describe key themes, motifs, or messages you want the story to explore"
                    className="min-h-20"
                    value={themes}
                    onChange={(e) => setThemes(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="prompt">Additional Details & Instructions</Label>
                <Textarea
                  id="prompt"
                  placeholder="Add any additional details, specific instructions, or elements you want the AI to include in your story..."
                  className="min-h-24"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="border p-4 rounded-md bg-muted/20 mt-2">
                <div className="flex items-center mb-2">
                  <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={showAdvancedOptions}
                      onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="rounded border-gray-300"
                      aria-label="Show Advanced Options"
                      title="Show Advanced Options"
                    />
                    <span>Show Advanced Options</span>
                  </Label>
                </div>
                
                {showAdvancedOptions && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="model">AI Model</Label>
                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                        disabled={isLoading || Object.keys(availableModels).length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(availableModels).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {key.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temperature">Creativity Level: {temperature}</Label>
                        <span className="text-xs text-muted-foreground">
                          {temperature < 0.4 ? "More predictable" : temperature > 0.7 ? "More creative" : "Balanced"}
                        </span>
                      </div>
                      <Input
                        id="temperature"
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center" htmlFor="useCustomKey">
                        <input 
                          id="useCustomKey"
                          type="checkbox"
                          checked={isUsingCustomKey}
                          onChange={() => setIsUsingCustomKey(!isUsingCustomKey)}
                          title="Use Custom Key"
                          placeholder="Use Custom Key"
                          className="mr-2 rounded border-gray-300"
                        />
                        Use my Groq API key
                      </Label>
                      
                      {isUsingCustomKey && (
                        <div className="pt-2">
                          <Label htmlFor="apiKey" className="flex items-center text-sm mb-1">
                            <Key className="h-3 w-3 mr-1" />
                            Groq API Key
                          </Label>
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="Enter your Groq API key"
                            value={userApiKey}
                            onChange={(e) => setUserApiKey(e.target.value)}
                            disabled={isLoading}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Using your own key helps with API limits and privacy. Get a free key at{" "}
                            <a 
                              href="https://console.groq.com/keys" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline"
                            >
                              console.groq.com
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {generatedContent ? (
                <div className="mt-6 border rounded-lg p-4 bg-card">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-lg">Generated Story</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab("mint");
                      }}
                    >
                      {storyFormat === 'nft' ? 'Continue to NFT' : 'Continue to Publish'}
                    </Button>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-h-96 overflow-y-auto border rounded p-4 bg-muted/20">
                    {generatedContent.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {isGroqLoading ? (
                    <LoadingStateIndicator message={null} />
                  ) : (
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex gap-4 justify-end">
                        <Button
                          onClick={handleGenerate}
                          disabled={isGroqLoading}
                          className="theme-gradient-bg min-w-32"
                        >
                          {isGroqLoading ? (
                            <div className="flex items-center space-x-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <span>Generating...</span>
                              </motion.div>
                            </div>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              {storyFormat === 'nft' ? 'Generate for NFT' : 'Generate & Publish'}
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={handleGenerateAndMint}
                          disabled={isGroqLoading || isMonadLoading || !account || !isOnMonadNetwork}
                          className="theme-gradient-bg"
                          title={!account ? "Connect wallet to mint NFT" : !isOnMonadNetwork ? "Switch to Monad network" : ""}
                        >
                          {isGroqLoading || isMonadLoading ? (
                            <motion.div 
                              className="flex items-center space-x-2"
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <motion.div
                                animate={{ 
                                  rotate: 360,
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                  scale: { duration: 1, repeat: Infinity }
                                }}
                                className="relative"
                              >
                                <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm"></div>
                                <Zap className="h-4 w-4 text-primary relative z-10" />
                              </motion.div>
                              <span>Creating Magic...</span>
                            </motion.div>
                          ) : (
                            <>
                              <Wallet className="mr-2 h-4 w-4" />
                              {storyFormat === 'nft' ? 'Generate & Mint NFT' : 'Generate & Publish'}
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {isGroqLoading && (
                        <motion.div 
                          className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden mt-2"
                        >
                          <motion.div 
                            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-primary/60 via-blue-400/60 to-primary/60"
                            animate={{ 
                              x: ["-100%", "100%"],
                              backgroundPosition: ["0% 0%", "100% 0%"] 
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut" 
                            }}
                            style={{ backgroundSize: "200% 100%" }}
                          />
                        </motion.div>
                      )}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="mint" className="space-y-4 mt-4">
              {!account && storyFormat === 'nft' ? (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Connect Wallet to Mint NFTs</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to connect your wallet to mint your stories as NFTs on Monad blockchain
                  </p>
                  <Button className="theme-gradient-bg">
                    Connect Wallet
                  </Button>
                </div>
              ) : !isOnMonadNetwork && storyFormat === 'nft' ? (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Switch to Monad Network</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to switch to the Monad network to mint NFTs
                  </p>
                  <Button 
                    onClick={switchToMonadNetwork}
                    className="theme-gradient-bg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Switching...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Switch to Monad
                      </>
                    )}
                  </Button>
                </div>
              ) : !generatedContent ? (
                <div className="text-center py-8">
                  <BookText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Story Generated Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate a story first before {storyFormat === 'nft' ? 'minting it as an NFT' : 'publishing it'}
                  </p>
                  <Button 
                    onClick={() => setActiveTab("generate")}
                    className="theme-gradient-bg"
                  >
                    Go to Story Generator
                  </Button>
                </div>
              ) : mintedNftUrl ? (
                <div className="text-center py-8">
                  <CopyCheck className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {storyFormat === 'nft' ? 'NFT Minted Successfully!' : 'Story Published Successfully!'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {storyFormat === 'nft' 
                      ? 'Your story has been successfully minted as an NFT on the Monad blockchain'
                      : 'Your story has been successfully published and is now available to readers'}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      className="theme-gradient-bg"
                      onClick={() => {
                        // Set a navigation flag in localStorage
                        try {
                          const navData = { 
                            from: 'generator', 
                            destination: 'nft-view',
                            timestamp: Date.now() 
                          };
                          localStorage.setItem('navigationData', JSON.stringify(navData));
                        } catch (e) {
                          console.error('Error storing navigation data:', e);
                        }
                        
                        // Use setTimeout to ensure reliable navigation
                        setTimeout(() => {
                          window.location.href = mintedNftUrl;
                        }, 100);
                      }}
                    >
                      {storyFormat === 'nft' ? 'View Your NFT' : 'View Your Story'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPrompt("");
                        setTitle("");
                        setMainCharacters("");
                        setPlotOutline("");
                        setSetting("");
                        setThemes("");
                        setGeneratedContent("");
                        setMintedNftUrl("");
                        setActiveTab("generate");
                      }}
                    >
                      Create Another
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Story Preview</h3>
                    <h4 className="text-lg font-bold">{title || "Untitled AI Story"}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Genres: {selectedGenres.map(g => g.charAt(0).toUpperCase() + g.slice(1).replace('-', ' ')).join(", ")}
                    </p>
                    <div className="prose prose-sm max-h-40 overflow-y-auto">
                      {generatedContent.substring(0, 300)}...
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleMintNFT}
                    disabled={isLoading}
                    className="w-full theme-gradient-bg"
                  >
                    {isMinting ? (
                      <motion.div 
                        className="flex items-center justify-center space-x-2"
                        animate={{ 
                          scale: [1, 1.03, 1],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: 360,
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                          className="relative"
                        >
                          <CopyCheck className="h-4 w-4 text-white" />
                        </motion.div>
                        <motion.span
                          animate={{
                            opacity: [0.7, 1],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          {storyFormat === 'nft' ? 'Minting NFT...' : 'Publishing...'}
                        </motion.span>
                      </motion.div>
                    ) : (
                      <>
                        <CopyCheck className="mr-2 h-4 w-4" />
                        {storyFormat === 'nft' ? 'Mint as NFT' : 'Publish Story'}
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    {storyFormat === 'nft' 
                      ? 'By minting this NFT, you confirm that you have the rights to this content and agree to the terms of service.'
                      : 'By publishing this story, you confirm that you have the rights to this content and agree to the terms of service.'}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start border-t pt-4">
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">
              <strong>Powered by:</strong> Groq AI + Monad Blockchain
            </p>
            <p>
              <strong>Network:</strong> {networkInfo?.name || "Loading network info..."}
            </p>
          </div>
          <Button 
            className="theme-gradient-bg mt-4 w-full"
            onClick={() => {
              // Set a navigation flag in localStorage
              try {
                const navData = { from: 'generator', timestamp: Date.now() };
                localStorage.setItem('navigationData', JSON.stringify(navData));
              } catch (e) {
                console.error('Error storing navigation data:', e);
              }
              
              // Use setTimeout to ensure reliable navigation
              setTimeout(() => {
                window.location.href = '/create/ai-story';
              }, 100);
            }}
          >
            <BookText className="mr-2 h-4 w-4" />
            Create Full Story
          </Button>
        </CardFooter>
      </Card>
    </>
  );
} 