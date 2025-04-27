"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Loader2, Sparkles, BookText, CopyCheck, Wallet, Key, Zap, Stars, Send, RefreshCw, Wand2, Type, Download, Copy, BookOpen, Rocket, ChevronLeft, ChevronRight, Layout } from "lucide-react";
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
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const { generate, generateIdeas, availableModels, defaultModel, isLoading: isGroqLoading, error: groqError, fetchModels, modelNames, testConnection } = useGroq();
  const { mintNFT, generateAndMint, isLoading: isMonadLoading, networkInfo, error: monadError, isOnMonadNetwork, switchToMonadNetwork } = useMonad();
  const { account, connectWallet } = useWeb3();
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([initialGenre]);
  const [storyType, setStoryType] = useState("text");
  const [overview, setOverview] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [generatedAnalysis, setGeneratedAnalysis] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingNFT, setIsGeneratingNFT] = useState(false);
  const [nftTokenId, setNFTTokenId] = useState<string>('');
  const [nftTransactionHash, setNFTTransactionHash] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel || '');
  const [temperature, setTemperature] = useState(0.7);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNftUrl, setMintedNftUrl] = useState("");
  const [storyFormat, setStoryFormat] = useState(initialFormat);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [panelImage, setPanelImage] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);

  // Story outline fields
  const [mainCharacters, setMainCharacters] = useState("");
  const [plotOutline, setPlotOutline] = useState("");
  const [setting, setSetting] = useState("");
  const [themes, setThemes] = useState("");
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [isUsingCustomKey, setIsUsingCustomKey] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);

  // Add this state variable near the other state declarations
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(showWelcome);

  // Add these state variables to your component
  const [error, setError] = useState<string | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [streaming, setStreaming] = useState<boolean>(false);

  // Temporary variable to accumulate content during streaming
  let tempGeneratedContent = '';

  // Model names for display
  const modelDisplayNames: Record<string, string> = {
    [availableModels.OPENAI || 'openai']: "ChatGPT (OpenAI)",
    [availableModels.GROQ || 'groq']: "Llama 3.1 (via Groq)"
  };

  // Fetch models function (mock for now)
  const fetchAvailableModels = useCallback(async () => {
    // In a real app, this would fetch from an API
    // For now, we just use the existing available models
    // No action needed as availableModels is already defined
  }, []);

  // Set default model when available
  useEffect(() => {
    if (defaultModel) {
      setSelectedModel(defaultModel);
    } else {
      // Fallback to a known valid model if defaultModel is not set
      setSelectedModel(availableModels.LLAMA_3_70B || 'llama-3.3-70b-versatile');
    }
  }, [defaultModel, availableModels]);

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
        fetchAvailableModels();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isGroqLoading, fetchAvailableModels]);

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

  // Effect to load image for the current comic panel
  useEffect(() => {
    if (storyType === 'comic' && generatedContent) {
      let panels;
      try {
        const parsedData = JSON.parse(generatedContent);
        panels = parsedData.panels || parseComicPanelsFromText(generatedContent);
      } catch (e) {
        panels = parseComicPanelsFromText(generatedContent);
      }
      if (panels.length > 0 && currentPanelIndex < panels.length) {
        const currentPanel = panels[currentPanelIndex];
        const loadImage = async () => {
          setIsLoadingImage(true);
          const imageUrl = await generateImageWithImagen(currentPanel.caption);
          setPanelImage(imageUrl);
          setIsLoadingImage(false);
        };
        loadImage();
      }
    }
  }, [currentPanelIndex, generatedContent, storyType]);

  // Constructs a well-engineered prompt based on user inputs
  const constructPrompt = () => {
    // Base prompt template with clear instructions for the AI
    let engineeredPrompt = `
# Creative Writing Task: Generate a Compelling Story

## Story Parameters
- Title: ${title || "[Generate an appropriate title]"}
- Story Type: ${storyType === "comic" ? "Comic Style Story (formatted with panel-by-panel breakdowns and dialogue for a graphic novel style, strictly in comic format with dialogues as captions)" : "Text Story (traditional narrative text format with detailed prose)"}
- Genres: ${selectedGenres.map(g => g.replace(/-/g, ' ')).join(", ") || "[Select appropriate genres if not specified]"}
- Overview: ${overview || "[No overview provided, use creativity based on other inputs]"}
- Creativity Level: ${temperature < 0.4 ? "Low (more predictable and structured)" : temperature > 0.7 ? "High (more creative and experimental)" : "Balanced (mix of structure and creativity)"}

## Detailed Story Elements
`;

    // Add character details if provided
    if (mainCharacters.trim()) {
      engineeredPrompt += `
### Main Characters
${mainCharacters}
`;
    } else {
      engineeredPrompt += `
### Main Characters
[Not specified, create compelling characters based on genre and overview]
`;
    }

    // Add setting details if provided
    if (setting.trim()) {
      engineeredPrompt += `
### World & Setting
${setting}
`;
    } else {
      engineeredPrompt += `
### World & Setting
[Not specified, develop a fitting setting based on genre and other inputs]
`;
    }

    // Add plot outline if provided
    if (plotOutline.trim()) {
      engineeredPrompt += `
### Plot Outline
${plotOutline}
`;
    } else {
      engineeredPrompt += `
### Plot Outline
[Not specified, craft an engaging plot based on provided elements]
`;
    }

    // Add themes if provided
    if (themes.trim()) {
      engineeredPrompt += `
### Themes & Motifs to Explore
${themes}
`;
    } else {
      engineeredPrompt += `
### Themes & Motifs to Explore
[Not specified, incorporate relevant themes based on genre and story context]
`;
    }

    // Add user's specific prompt/request if provided
    if (prompt.trim()) {
      engineeredPrompt += `
### Additional Details & Specific Instructions
${prompt}
`;
    } else {
      engineeredPrompt += `
### Additional Details & Specific Instructions
[No additional instructions provided, use best judgment for story enhancement]
`;
    }

    // Add specific instructions about formatting and structure based on story type
    engineeredPrompt += `
## Output Format & Guidelines
- Begin with a captivating title if one wasn't provided
`;
    if (storyType === "comic") {
      engineeredPrompt += `- Structure the story in a comic book format with panel-by-panel descriptions and dialogue. Clearly label each panel (e.g., Panel 1, Panel 2) and describe the visual content and character dialogue or captions for each panel to create a graphic novel style. Ensure that captions are strictly dialogues.
`;
    } else {
      engineeredPrompt += `- Structure the story with clear sections and paragraphs for readability. Focus on detailed prose and narrative depth to create an immersive reading experience.
`;
    }
    engineeredPrompt += `- Include rich descriptions and vivid dialogue to enhance immersion
- Develop characters with depth, motivation, and distinct personalities
- Maintain an engaging narrative arc with a clear beginning, middle, and conclusion
- Aim for a cohesive story of approximately 1000-1500 words

Please generate this story with attention to quality, creativity, and narrative coherence. Adjust the style based on the specified creativity level and ensure all provided elements are cohesively integrated into the final output.
`;

    return engineeredPrompt;
  };

  // Handle generating a story with Groq
  const handleGenerate = async () => {
    console.log('Generate button clicked');
    if (isGroqLoading || isActionLoading) return;
    setIsActionLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      let result;
      if (storyType === 'comic') {
        // Use Stability AI for comic style image generation along with Groq for narrative
        result = await generateComicStory();
      } else {
        const options: { temperature: number; apiKey?: string } = { temperature: temperature };
        if (isUsingCustomKey && userApiKey) {
          options.apiKey = userApiKey;
        }
        result = await generate(constructPrompt(), selectedModel, options);
      }
      setGeneratedContent(result);
      setShowOutput(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the story');
      console.error('Generation error:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const generateComicStory = async () => {
    try {
      // First, generate comic narrative with Groq
      const comicStoryText = await generate(constructPrompt(), selectedModel, { temperature: 0.7 });
      
      // Then parse the output to create a comic data structure
      let panels = parseComicPanelsFromText(comicStoryText);
      
      // Ensure minimum 7 panels and maximum 20 panels
      if (panels.length < 7) {
        // If less than 7 panels, create additional placeholder panels
        const additionalPanelsNeeded = 7 - panels.length;
        for (let i = 0; i < additionalPanelsNeeded; i++) {
          panels.push({
            number: panels.length + 1,
            caption: `Panel ${panels.length + 1} - Additional scene to be described...`,
            dialogue: []
          });
        }
      } else if (panels.length > 20) {
        // If more than 20 panels, trim to 20
        panels = panels.slice(0, 20);
        // Renumber the panels to ensure consecutive numbering
        panels = panels.map((panel, index) => ({
          ...panel,
          number: index + 1
        }));
      }
      
      // Format the result as JSON
      const comicData = {
        title: title || extractTitleFromStory(comicStoryText),
        panels: panels
      };
      
      return JSON.stringify(comicData, null, 2);
    } catch (error) {
      console.error('Error generating comic story:', error);
      throw error;
    }
  };

  // Helper function to parse comic panels from text
  const parseComicPanelsFromText = (text: string) => {
    const lines = text.split('\n');
    const panels: Array<{
      number: number;
      caption: string;
      dialogue: Array<{character: string; text: string}>;
    }> = [];
    let currentPanel: {
      number: number;
      caption: string;
      dialogue: Array<{character: string; text: string}>;
    } | null = null;
    
    for (const line of lines) {
      // Look for panel markers like "Panel 1:" or "PANEL 1:"
      const panelMatch = line.match(/^(?:panel|PANEL)\s*(\d+)[:.\-]?\s*(.*)/i);
      
      if (panelMatch) {
        if (currentPanel) {
          panels.push(currentPanel);
        }
        
        currentPanel = {
          number: parseInt(panelMatch[1]),
          caption: panelMatch[2] || "",
          dialogue: []
        };
      } 
      // If we're in a panel and find dialogue
      else if (currentPanel && line.trim() && !line.startsWith('#')) {
        // If line has character speaking format like "Character: Dialogue"
        const dialogueMatch = line.match(/^([^:]+):\s*(.+)/);
        
        if (dialogueMatch) {
          currentPanel.dialogue.push({
            character: dialogueMatch[1].trim(),
            text: dialogueMatch[2].trim()
          });
        } 
        // Otherwise add to caption if it's meaningful content
        else if (line.trim().length > 3 && !line.startsWith('-')) {
          currentPanel.caption += " " + line.trim();
        }
      }
    }
    
    // Add the last panel
    if (currentPanel) {
      panels.push(currentPanel);
    }
    
    // If no panels were found, create some based on text chunks
    if (panels.length === 0) {
      const chunks = text.split('\n\n').filter((chunk: string) => chunk.trim().length > 0);
      for (let i = 0; i < Math.min(chunks.length, 4); i++) {
        panels.push({
          number: i + 1,
          caption: chunks[i],
          dialogue: []
        });
      }
    }
    
    return panels;
  };

  // Extract title from story if none provided
  const extractTitleFromStory = (text: string) => {
    const firstLine = text.split('\n')[0];
    if (firstLine.startsWith('# ')) {
      return firstLine.substring(2).trim();
    }
    return "Comic Story";
  };

  // Handle generating a story and minting it as an NFT in one step
  const handleGenerateAndMint = async () => {
    // Validate wallet connection for NFT minting
    if (storyFormat === 'nft' && !account) {
      console.log('Wallet not connected for NFT minting');
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint stories as NFTs",
        variant: "destructive",
      });
      return;
    }
    // Log wallet and network status for debugging
    console.log('Wallet connected:', !!account);
    console.log('On Monad network:', isOnMonadNetwork);

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
          console.log('Wallet connection required for NFT minting');
          throw new Error("Wallet connection required for NFT minting");
        }
        
        if (!isOnMonadNetwork) {
          console.log('Not on Monad network');
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
        const modelToUse = selectedModel || defaultModel || availableModels.LLAMA_3_70B || 'llama-3.3-70b-versatile';
        const content = await generate(
          engineeredPrompt,
          modelToUse,
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
      console.log('Wallet not connected for minting');
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to " + (storyFormat === 'nft' ? "mint NFTs" : "publish stories"),
        variant: "destructive",
      });
      return;
    }
    // Log wallet status for debugging
    console.log('Wallet connected for minting:', !!account);

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
        authorAddress: account, // Ensure the NFT is owned by the user's wallet address
        coverImage: `https://source.unsplash.com/random/800x600/?${selectedGenres.join(", ")}`,
        genre: selectedGenres.join(", "),
        createdAt: new Date().toISOString(),
        aiModel: selectedModel,
        aiPrompt: constructPrompt(),
        tags: selectedGenres
      };
      
      if (storyFormat === 'nft') {
        // Check if user is a paid user - this is a placeholder, actual implementation would check user subscription status
        const isPaidUser = localStorage.getItem('isPaidUser') === 'true'; // Placeholder for actual subscription check
        if (!isPaidUser) {
          toast({
            title: "Upgrade Required",
            description: "You need to be a paid user to mint NFTs. Upgrade your account to access this feature.",
            variant: "destructive",
          });
          setIsMinting(false);
          return;
        }
        
        // Note: Transaction fees for buying/selling NFTs should be handled in the backend/smart contract
        // Ensure that the backend applies a fee during NFT transactions
        const result = await mintNFT(metadata);
        
        if (result) {
          setMintedNftUrl(`/nft/${result.tokenId}`);
          
          toast({
            title: "NFT Minted Successfully",
            description: `Your story has been minted as NFT #${result.tokenId}`,
          });
        }
      } else {
        // For publishing to community (not minting as NFT)
        // In a real implementation, this would save to a database or backend service
        // For now, we'll simulate a successful publish
        setTimeout(() => {
          const mockStoryId = `story-${Date.now().toString(36)}`;
          setMintedNftUrl(`/stories/${mockStoryId}`);
          
          toast({
            title: "Story Published Successfully",
            description: "Your story has been published to the community",
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error " + (storyFormat === 'nft' ? "minting NFT" : "publishing story") + ":", error);
      toast({
        title: storyFormat === 'nft' ? "Mint Failed" : "Publish Failed",
        description: error.message || (storyFormat === 'nft' ? "Failed to mint NFT" : "Failed to publish story"),
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Function to generate story layouts as recommendations
  const generateStoryLayout = async () => {
    try {
      const layoutPrompt = constructLayoutPrompt();
      const layoutText = await generate(layoutPrompt, selectedModel, { temperature: 0.5 });
      setGeneratedContent(layoutText);
      setShowOutput(true);
    } catch (error) {
      console.error('Error generating story layout:', error);
      setError('An error occurred while generating the story layout');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Constructs a prompt specifically for story layouts
  const constructLayoutPrompt = () => {
    return `
# Story Layout Generator

## Task
Generate a structured story layout or outline based on the following parameters. Do not write a full story, but provide a clear structure with sections for introduction, main plot points, character development, and conclusion. Include placeholders for key scenes or events that the user can fill in.

## Story Parameters
- Genres: ${selectedGenres.map(g => g.replace(/-/g, ' ')).join(", ") || "[Select appropriate genres if not specified]"}
- Story Type: ${storyType === "comic" ? "Comic Style Outline (formatted with panel-by-panel breakdowns and placeholder dialogue for a graphic novel style)" : "Text Story Outline (traditional narrative structure with key scenes and plot points)"}
- Overview: ${overview || "[No overview provided, use creativity based on genres]"}

## Instructions
- Provide a title placeholder.
- Outline the story in a clear, structured format with numbered sections or panels.
- Include brief descriptions for each section or panel (2-3 sentences max).
- Leave room for user customization by including placeholder text like '[User can describe a key event here]' or '[Add character dialogue]'.
- Ensure the layout is genre-appropriate and engaging.
`;
  };

  const isLoading = isGroqLoading || isMonadLoading || isMinting || isActionLoading;

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

  // Function to fetch images from Unsplash as placeholders
  const fetchUnsplashImage = async (prompt: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;
      if (!apiKey || apiKey === 'your_unsplash_api_key_here') {
        throw new Error('Unsplash API key is not defined in environment variables');
      }

      console.log('Fetching image for prompt:', prompt);
      const query = encodeURIComponent(prompt.split(' ').slice(0, 3).join(' '));
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${apiKey}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch image from Unsplash: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      } else {
        throw new Error('No image found on Unsplash for the given query');
      }
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      // Return a placeholder image URL as fallback
      return 'https://via.placeholder.com/800x400?text=AI+Generated+Image+Failed';
    }
  };

  // Replace the generateImageWithImagen function call with fetchUnsplashImage
  const generateImageWithImagen = async (prompt: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_STABILITY_AI_API_KEY;
      if (!apiKey || apiKey === 'your_stability_ai_api_key_here') {
        throw new Error('Stability AI API key is not defined in environment variables');
      }

      console.log('Generating image for prompt:', prompt);
      const comicStylePrompt = `Comic book style drawing depicting: ${prompt}. The scene MUST be illustrated with bold lines, vibrant colors, and a non-realistic, hand-drawn aesthetic typical of classic graphic novels. STRICTLY AVOID any photorealistic, 3D rendered, or realism styles; focus exclusively on a 2D comic art style with clear outlines, flat colors, and dynamic compositions that enhance the narrative. Ensure the image looks like it belongs in a traditional comic book.`;
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: comicStylePrompt }],
          cfg_scale: 7,
          height: 512,
          width: 512,
          steps: 30,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image with Stability AI: ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.artifacts && data.artifacts.length > 0 && data.artifacts[0].base64) {
        return `data:image/png;base64,${data.artifacts[0].base64}`;
      } else {
        throw new Error('No image data returned from Stability AI API');
      }
    } catch (error) {
      console.error('Error generating image with Stability AI:', error);
      // Fallback to Unsplash image fetch
      return await fetchUnsplashImage(prompt);
    }
  };

  // Function to render the generated content
  const renderGeneratedContent = () => {
    if (!generatedContent) return null;

    if (storyType === 'comic') {
      let panels;
      try {
        const parsedData = JSON.parse(generatedContent);
        panels = parsedData.panels || parseComicPanelsFromText(generatedContent);
      } catch (e) {
        panels = parseComicPanelsFromText(generatedContent);
      }

      const handleNextPanel = () => {
        setCurrentPanelIndex((prevIndex) => Math.min(prevIndex + 1, panels.length - 1));
      };

      const handlePrevPanel = () => {
        setCurrentPanelIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      };

      if (panels.length === 0) {
        return <div className="text-center py-4">No comic panels generated.</div>;
      }

      const currentPanel = panels[currentPanelIndex];
      // Ensure the image prompt is strictly comic style with detailed description
      const comicStylePrompt = `Comic book style drawing depicting: ${currentPanel.caption}. The scene should be illustrated with bold lines, vibrant colors, and a non-realistic, hand-drawn aesthetic typical of classic graphic novels. Avoid photorealistic or 3D rendered styles; focus on a 2D comic art style with clear outlines and dynamic compositions that enhance the narrative.`;

      return (
        <div className="comic-container mt-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Comic Panels Presentation</h3>
          <div className="comic-slide bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Panel {currentPanel.number}</h4>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(currentPanel.caption + '\n' + currentPanel.dialogue.map((d: {character: string; text: string}) => `${d.character}: ${d.text}`).join('\n'));
                    toast({
                      title: "Copied",
                      description: "Panel text copied to clipboard",
                    });
                  }}
                  className="hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updatedPanel = window.prompt('Edit the panel description:', currentPanel.caption);
                    if (updatedPanel && updatedPanel !== currentPanel.caption) {
                      const updatedPanels = [...panels];
                      updatedPanels[currentPanelIndex].caption = updatedPanel;
                      setGeneratedContent(JSON.stringify({ title: title || extractTitleFromStory(generatedContent), panels: updatedPanels }));
                      toast({
                        title: "Updated",
                        description: "Panel updated successfully",
                      });
                    }
                  }}
                  className="hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="panel-image-container mb-2" style={{ height: '300px', overflow: 'hidden' }}>
              {isLoadingImage ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading image...</span>
                </div>
              ) : (
                <img src={panelImage} alt={`Panel ${currentPanel.number}`} className="w-full h-full object-cover rounded-lg" />
              )}
            </div>
            <div className="dialogue-container space-y-2 mt-2">
              {currentPanel.dialogue.map((dialogue: {character: string; text: string}, index: number) => (
                <div key={index} className="dialogue bg-gray-100 dark:bg-gray-600 p-2 rounded-lg">
                  <span className="font-bold text-gray-800 dark:text-white">{dialogue.character}: </span>
                  <span className="text-gray-700 dark:text-gray-300">{dialogue.text}</span>
                </div>
              ))}
              <div className="dialogue bg-gray-100 dark:bg-gray-600 p-2 rounded-lg">
                <span className="font-bold text-gray-800 dark:text-white">Caption: </span>
                <span className="text-gray-700 dark:text-gray-300">{currentPanel.caption}</span>
              </div>
            </div>
          </div>
          <div className="navigation-buttons flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handlePrevPanel}
              disabled={currentPanelIndex === 0}
              className="hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPanel}
              disabled={currentPanelIndex === panels.length - 1}
              className="hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Next
            </Button>
          </div>
          <div className="panel-indicator text-center mt-2 text-gray-600 dark:text-gray-400 text-sm">
            Panel {currentPanelIndex + 1} of {panels.length}
          </div>
        </div>
      );
    }

    const extractedTitle = extractTitleFromStory(generatedContent);
    // Remove the title from the content to prevent repetition
    let displayContent = generatedContent;
    if (extractedTitle && generatedContent.startsWith(extractedTitle)) {
      displayContent = generatedContent.substring(extractedTitle.length).trim();
    } else if (extractedTitle && generatedContent.startsWith(`# ${extractedTitle}`)) {
      displayContent = generatedContent.substring(extractedTitle.length + 2).trim();
    }

    return (
      <div className="mt-6 p-6 bg-card rounded-lg shadow-md border max-h-[60vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-4 text-card-foreground">{title || extractedTitle || 'Untitled AI Story'}</h2>
        <p className="text-sm text-muted-foreground mb-4">Genre: {selectedGenres.join(', ') || 'Not specified'}</p>
        <div className="mb-4"></div>
        <div className="prose dark:prose-invert max-w-none text-card-foreground">
          {displayContent}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => alert('Copy functionality will be implemented soon.')} className="hover:theme-gradient-bg hover:text-white transition-all duration-300">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={() => alert('Download functionality will be implemented soon.')} className="hover:theme-gradient-bg hover:text-white transition-all duration-300">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          {storyType === 'nft' && (
            <Button 
              className="theme-gradient-bg text-white border-0 hover:opacity-90 transition-all duration-300" 
              onClick={() => alert('Mint NFT functionality will be implemented soon.')} 
              disabled={false}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Mint as NFT
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Configure stream handlers for the story generation
  const setupStreamHandlers = () => {
    const onChunk = async (chunk: string, modelOutput: any) => {
      if (streaming) {
        setGeneratedContent((prevContent) => (prevContent ?? '') + chunk);
      }
      
      tempGeneratedContent += chunk;
      
      // If we're using LLaMa 3 (Groq) and stream was just completed
      if (modelOutput && modelOutput.complete) {
        // Wait a moment for async state updates
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (storyType === 'comic') {
          try {
            const comicPanels = parseComicPanelsFromText(tempGeneratedContent);
            const comicData = {
              title: title || extractTitleFromStory(tempGeneratedContent),
              panels: comicPanels
            };
            
            // Replace the generated content with structured comic data
            setGeneratedContent(JSON.stringify(comicData));
            
            // Save the comic JSON in addition to the raw markdown
            // Note: saveContent function doesn't exist in the current implementation
            // This section can be removed or implemented if needed
          } catch (e) {
            console.error('Failed to process comic panels:', e);
          }
        }
      }
    };

    return {
      onStart: () => {
        console.log('Stream started');
        setStreaming(true);
        setIsActionLoading(false);
        tempGeneratedContent = '';
      },
      onChunk,
      onComplete: (modelOutput: any) => {
        console.log('Stream completed');
        setStreaming(false);
      },
      onToken: (token: any, modelOutput: any) => {
        // Optional: Process individual tokens
      },
      onError: (error: Error) => {
        console.error('Stream error:', error);
        setStreaming(false);
        setIsActionLoading(false);
        setError(`Error: ${error.message}`);
      }
    };
  };

  // Add a new button or tab for generating story layouts
  const renderControls = () => {
    return (
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          onClick={handleGenerate} 
          disabled={isGroqLoading || isActionLoading} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isActionLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Story"
          )}
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline" 
          disabled={isGroqLoading || isActionLoading}
          className="border-gray-600 text-gray-600 hover:bg-gray-100"
        >
          Reset
        </Button>
        {account && (
          <Button 
            onClick={handleGenerateAndMint} 
            disabled={isGroqLoading || isActionLoading} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isActionLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating NFT...
              </>
            ) : (
              "Generate NFT (Paid Feature)"
            )}
          </Button>
        )}
      </div>
    );
  };

  const handleGenerateSummary = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!generatedContent) return;
    setIsSummarizing(true);
    try {
      const summaryPrompt = constructSummaryPrompt();
      const summary = await generate(summaryPrompt);
      setGeneratedSummary(summary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const analyzeStory = async () => {
    if (!generatedContent) {
      toast({
        title: "No content to analyze",
        description: "Please generate a story first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisPrompt = constructAnalysisPrompt();
      const analysis = await generate(analysisPrompt);
      setGeneratedAnalysis(analysis);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const constructSummaryPrompt = () => {
    return `You are a skilled storyteller tasked with summarizing a story. Your summary should capture the essence of the narrative in a concise yet engaging manner. Focus on the main plot points, key characters, and significant events. Avoid unnecessary details or tangents. Keep the summary under 200 words.\n\nStory to summarize:\n${generatedContent}\n\nSummary:`;
  };

  const constructAnalysisPrompt = () => {
    return `You are a literary critic tasked with analyzing a story. Provide a detailed analysis that includes:\n- Identification of genre(s) and themes\n- Examination of character development and key character arcs\n- Assessment of narrative structure and pacing\n- Notable strengths in the storytelling\n- Suggestions for improvement or areas that could be expanded\n\nKeep your analysis clear, insightful, and under 400 words.\n\nStory to analyze:\n${generatedContent}\n\nAnalysis:`;
  };

  const handleReset = () => {
    setGeneratedContent('');
    setGeneratedSummary('');
    setGeneratedAnalysis('');
    setIsGenerating(false);
    setIsSummarizing(false);
    setIsAnalyzing(false);
    setIsActionLoading(false);
  };

  const handleGenerateNFT = async () => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to generate an NFT.",
        variant: "destructive",
      });
      return;
    }
    if (!generatedContent) {
      toast({
        title: "No story generated",
        description: "Please generate a story before creating an NFT.",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingNFT(true);
    try {
      const response = await fetch('/api/monad/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyHash: `story-${Date.now()}`, // Placeholder for actual story hash
          metadataURI: `metadata-${Date.now()}.json`, // Placeholder for actual metadata URI
          userAddress: account,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "NFT Minted",
          description: `Your story NFT has been minted with token ID: ${data.tokenId}`,
        });
        setNFTTokenId(data.tokenId || '');
        setNFTTransactionHash(data.transactionHash || '');
      } else {
        toast({
          title: "Minting Failed",
          description: data.error || "Failed to mint NFT. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while minting the NFT.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNFT(false);
    }
  };

  // Add state and handler for wallet dialog
  const [showWalletDialog, setShowWalletDialog] = useState(false);

  const handleContinue = async () => {
    if (!account) {
      setShowWalletDialog(true);
      return;
    }
    // ... existing code for handleContinue ...
  };

  const handleWalletConnect = async (walletType: string) => {
    try {
      toast({
        title: "Connecting Wallet",
        description: "Please approve the connection request in your wallet",
      });
      console.log(`Attempting to connect to ${walletType}`);
      await connectWallet();
      setShowWalletDialog(false);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletType.charAt(0).toUpperCase() + walletType.slice(1)}`,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
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
                <Label>Story Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={storyType === "text" ? "default" : "outline"}
                    onClick={() => setStoryType("text")}
                    className={storyType === "text" ? "bg-primary text-white" : "text-primary"}
                  >
                    Text Story
                  </Button>
                  <Button
                    variant={storyType === "comic" ? "default" : "outline"}
                    onClick={() => setStoryType("comic")}
                    className={storyType === "comic" ? "bg-primary text-white" : "text-primary"}
                  >
                    Comic
                  </Button>
                </div>
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
                          <div className="flex space-x-2">
                        <Input
                          id="apiKey"
                          type="password"
                          placeholder="Enter your Groq API key"
                          value={userApiKey}
                          onChange={(e) => setUserApiKey(e.target.value)}
                          disabled={isLoading}
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={!userApiKey || isLoading}
                              onClick={async () => {
                                try {
                                  toast({
                                    title: "Testing API Key",
                                    description: "Please wait while we verify your API key...",
                                  });
                                  
                                  const result = await testConnection(userApiKey, true);
                                  
                                  if (result.success) {
                                    toast({
                                      title: "API Key Valid",
                                      description: `Successfully connected to ${result.model || 'Groq API'}`,
                                    });
                                  } else {
                                    toast({
                                      title: "API Key Invalid",
                                      description: result.message,
                                      variant: "destructive",
                                    });
                                  }
                                } catch (error: any) {
                                  toast({
                                    title: "Test Failed",
                                    description: error.message || "Could not test API key",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Test Key
                            </Button>
                          </div>
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
                <motion.div 
                  className="mt-6 border rounded-xl p-6 bg-gradient-to-br from-background via-background/95 to-primary/5 shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <motion.h3 
                      className="font-medium text-xl text-primary flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                      Generated {storyType === "comic" ? "Comic Style Story" : "Text Story"}
                    </motion.h3>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveTab("mint");
                    }}
                        className="hover:bg-primary/10 border-primary/30 text-primary"
                  >
                    {storyFormat === 'nft' ? 'Continue to NFT' : 'Continue to Publish'}
                  </Button>
                    </motion.div>
                </div>
                  <motion.div 
                    className="bg-gradient-to-r from-primary/10 via-amber-500/5 to-primary/10 p-1 rounded-lg overflow-hidden relative"
                    initial={{ scale: 0.98, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-30"></div>
                    <div className="prose prose-lg dark:prose-invert max-h-96 overflow-y-auto p-6 bg-background rounded-md relative z-10">
                      {renderGeneratedContent()}
                </div>
                  </motion.div>
                  <motion.div 
                    className="mt-4 flex justify-end gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent);
                        toast({
                          title: "Copied",
                          description: "Story copied to clipboard",
                        });
                      }}
                      className="text-primary hover:bg-primary/5 border-primary/20"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Story
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([generatedContent], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${title || 'Untitled_Story'}.md`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="text-primary hover:bg-primary/5 border-primary/20"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {isGroqLoading ? (
                    <LoadingStateIndicator message={null} />
                  ) : (
                    <div className="flex flex-col gap-4 mt-4">
                      {renderControls()}
                      
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
                <Button className="theme-gradient-bg" onClick={async () => {
                  try {
                    toast({
                      title: "Connecting Wallet",
                      description: "Please approve the connection request in your wallet",
                    });
                    await connectWallet();
                  } catch (error: any) {
                    console.error('Error connecting wallet:', error);
                    toast({
                      title: "Connection Failed",
                      description: error.message || "Failed to connect wallet. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}>
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
            ) : !account && storyFormat !== 'nft' ? (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Connect Wallet to Publish Stories</h3>
                <p className="text-muted-foreground mb-4">
                  You need to connect your wallet to publish stories to the community
                </p>
                <Button className="theme-gradient-bg" onClick={async () => {
                  try {
                    toast({
                      title: "Connecting Wallet",
                      description: "Please approve the connection request in your wallet",
                    });
                    await connectWallet();
                  } catch (error: any) {
                    console.error('Error connecting wallet:', error);
                    toast({
                      title: "Connection Failed",
                      description: error.message || "Failed to connect wallet. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}>
                  Connect Wallet
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
          <p>
            <strong>Community:</strong> <a href="https://indie-hub-landing-page-git-main-dragos-projects-f5e4e2da.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Indie Hub</a>
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

    <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Connect a wallet to publish your NFT story. Choose an option below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline" className="w-full" onClick={() => handleWalletConnect('metamask')}>
            <Image src="/wallet-logos/metamask.png" alt="MetaMask" width={24} height={24} className="mr-2" />
            MetaMask
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleWalletConnect('walletconnect')}>
            <Image src="/wallet-logos/walletconnect.png" alt="WalletConnect" width={24} height={24} className="mr-2" />
            WalletConnect
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleWalletConnect('ledger')}>
            <Image src="/wallet-logos/ledger.png" alt="Ledger" width={24} height={24} className="mr-2" />
            Ledger Wallet
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-2">Scan QR Code for mobile wallets</p>
            <div className="flex justify-center">
              <Image src="/qr-code-placeholder.png" alt="QR Code for Wallet Connection" width={150} height={150} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
} 