"use client";

import { useState, useEffect, useCallback } from "react";
import { useGroq } from "@/hooks/use-groq";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StoryButton, NFTButton, PrimaryAnimatedButton } from "@/components/ui/animated-button";
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
  const { connectWallet, account, mintNFTOnBase } = useWeb3();
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
          // Placeholder for image generation function
          const imageUrl = 'https://via.placeholder.com/800x400?text=Comic+Panel';
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
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to generate and mint an NFT.",
        variant: "destructive",
      });
      return;
    }

    // No need to check for specific network - the mintNFTOnBase function will handle switching
    setIsActionLoading(true);

    try {
      const engineeredPrompt = constructPrompt();
      
      // Show a progress toast
      toast({
        title: "Generating Story",
        description: "Creating your unique story with AI...",
      });

      // Prepare options for generation
      const options: { temperature: number; apiKey?: string } = { temperature: temperature };
      if (isUsingCustomKey && userApiKey) {
        options.apiKey = userApiKey;
      }

      // First generate the story content
      let storyContent;
      try {
        if (storyType === 'comic') {
          // Use comic generation logic
          storyContent = await generateComicStory();
        } else {
          // Use regular text story generation
          storyContent = await generate(engineeredPrompt, selectedModel, options);
        }
      } catch (genError) {
        console.error("Story generation error:", genError);
        throw new Error(`Failed to generate story: ${genError instanceof Error ? genError.message : "Unknown error"}`);
      }

      if (!storyContent) {
        throw new Error("Failed to generate story content");
      }

      // Extract title from the generated content
      const storyTitle = title || extractTitleFromStory(storyContent);
      
      // Set the generated content
      setGeneratedContent(storyContent);
      
      // Show minting toast
      toast({
        title: "Story Generated!",
        description: "Now minting your story as an NFT...",
      });

      // For NFT minting
      try {
        // Prepare NFT metadata
        const nftMetadata = {
          title: storyTitle,
          description: `A ${selectedGenres.join(", ")} story created with GroqTales`,
          content: storyContent,
          creator: account,
          createdAt: new Date().toISOString(),
          genres: selectedGenres,
          storyType: storyType,
          model: selectedModel
        };
        
        // Call mint with the generated content
        const result = await mintNFTOnBase(
          nftMetadata,
          account
        );
        
        if (!result) {
          throw new Error("Failed to mint NFT");
        }
        
        // Store the token ID and transaction hash
        setNFTTokenId(result.tokenId);
        setNFTTransactionHash(result.transactionHash);
        
        // Set minted NFT URL
        setMintedNftUrl(`/nft-gallery/${result.tokenId}`);
        setActiveTab("mint");
        
        toast({
          title: "NFT Minted Successfully! 🎉",
          description: `Your story "${storyTitle}" has been minted as NFT #${result.tokenId}`,
        });
      } catch (mintError) {
        console.error("NFT minting error:", mintError);
        
        // Still show the generated content even if minting fails
        setActiveTab("generate");
        
        throw new Error(`Story generated successfully, but minting failed: ${mintError instanceof Error ? mintError.message : "Unknown error"}`);
      }
    } catch (error) {
      console.error("Generate and mint error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle minting the generated story as an NFT
  const handleMintNFT = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint an NFT.",
        variant: "destructive",
      });
      return;
    }

    // Check if we have generated content
    if (!generatedContent) {
      toast({
        title: "No Content",
        description: "Please generate a story first before minting.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    try {
      toast({
        title: "Preparing NFT",
        description: "Processing your story for minting...",
      });
      
      // Extract title from the generated content if not set
      const storyTitle = title || extractTitleFromStory(generatedContent);
      
      // Prepare NFT metadata
      const nftMetadata = {
        title: storyTitle,
        description: `A ${selectedGenres.join(", ")} story created with GroqTales`,
        content: generatedContent,
        creator: account,
        createdAt: new Date().toISOString(),
        genres: selectedGenres,
        storyType: storyType,
        model: selectedModel || "unknown"
      };
      
      toast({
        title: "Minting NFT",
        description: "Uploading to IPFS and minting on blockchain...",
      });
      
      // Call mint with the generated content
      const result = await mintNFTOnBase(
        nftMetadata,
        account
      );
      
      if (!result) {
        throw new Error("Failed to mint NFT");
      }
      
      // Store the token ID and transaction hash
      setNFTTokenId(result.tokenId);
      setNFTTransactionHash(result.transactionHash);
      
      // Set minted NFT URL
      setMintedNftUrl(`/nft-gallery/${result.tokenId}`);
      
      toast({
        title: "NFT Minted Successfully! 🎉",
        description: `Your story "${storyTitle}" has been minted as NFT #${result.tokenId}`,
      });
      
      // Add a small delay before showing success state
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Error",
        description: error instanceof Error ? error.message : "An error occurred while minting your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  function switchToMonadNetwork(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    
    // Monad Testnet Chain ID and parameters
    const MONAD_CHAIN_ID = '0x27cf'; // 10191 in decimal
    const MONAD_CHAIN_PARAMS = {
      chainId: MONAD_CHAIN_ID,
      chainName: 'Monad Testnet',
      nativeCurrency: {
        name: 'Monad',
        symbol: 'MONAD',
        decimals: 18
      },
      rpcUrls: ['https://testnet-rpc.monad.xyz'],
      blockExplorerUrls: ['https://explorer.monad.xyz/']
    };
    
    // Check if ethereum is available in window
    if (typeof window === 'undefined' || !window.ethereum) {
      toast({
        title: "No Wallet Detected",
        description: "Please install a Web3 wallet like MetaMask to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setIsActionLoading(true);
    
    // Create a safe reference to window.ethereum
    const ethereum = window.ethereum;
    
    // First try to switch to the network
    ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MONAD_CHAIN_ID }]
    }).catch((switchError: any) => {
      // If the network doesn't exist in the wallet, add it
      if (switchError.code === 4902) {
        ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [MONAD_CHAIN_PARAMS]
        }).then(() => {
          toast({
            title: "Network Added",
            description: "Monad Testnet has been added to your wallet."
          });
        }).catch((addError: any) => {
          console.error("Error adding network:", addError);
          toast({
            title: "Network Addition Failed",
            description: "Failed to add Monad Testnet to your wallet.",
            variant: "destructive"
          });
        });
      } else {
        console.error("Error switching network:", switchError);
        toast({
          title: "Network Switch Failed",
          description: "Failed to switch to Monad Testnet.",
          variant: "destructive"
        });
      }
    }).finally(() => {
      setIsActionLoading(false);
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-0 shadow-none bg-background/50 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">AI Story Generator</CardTitle>
          <CardDescription className="text-center text-lg max-w-2xl mx-auto mb-4">Create unique stories with the power of AI. Choose your genre, set your preferences, and let the magic happen.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="generate">Generate Story</TabsTrigger>
          <TabsTrigger value="nft">Mint NFT</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="space-y-6 mt-0">
          <Card className="border-0 shadow-md overflow-hidden bg-background/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-border/30 pb-2 mb-4">
              <CardTitle className="text-xl text-center text-primary mb-2">Story Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mb-4 pb-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="genre" className="pl-1">Genre</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {genres.slice(0, 5).map((genre) => (
                      <Button
                        key={genre.slug}
                        variant={selectedGenres.includes(genre.slug) ? "default" : "outline"}
                        size="sm"
                        className={`rounded-full ${selectedGenres.includes(genre.slug) ? 'bg-primary text-white' : 'border-border/50 text-foreground/80 hover:bg-muted/80'}`}
                        onClick={() => {
                          setSelectedGenres((prev) => {
                            if (prev.includes(genre.slug)) {
                              return prev.filter((g) => g !== genre.slug);
                            } else if (prev.length < 3) {
                              return [...prev, genre.slug];
                            } else {
                              return [genre.slug];
                            }
                          });
                        }}
                      >
                        {genre.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="prompt" className="pl-1">Story Prompt (optional)</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter a brief idea or theme for your story..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="rounded-md border-border/50 bg-muted/50 focus-visible:ring-primary/30 min-h-[80px] mb-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden bg-background/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-border/30 pb-2 mb-4">
              <CardTitle className="text-xl text-center text-primary mb-2">Story Outline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mb-4 pb-0">
              <div className="space-y-4">
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
                    disabled={isGroqLoading || isActionLoading}
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
                    disabled={isGroqLoading || isActionLoading}
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
                    disabled={isGroqLoading || isActionLoading}
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
                    disabled={isGroqLoading || isActionLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden bg-background/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-border/30 pb-2 mb-4">
              <CardTitle className="text-xl text-center text-primary mb-2">Story Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mb-4 pb-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Story Title (Optional)</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title or leave blank for AI to generate one"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isGroqLoading || isActionLoading}
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
                    disabled={isGroqLoading || isActionLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden bg-background/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-border/30 pb-2 mb-4">
              <CardTitle className="text-xl text-center text-primary mb-2">Creativity Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mb-4 pb-0">
              <div className="space-y-4">
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
                    disabled={isGroqLoading || isActionLoading}
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
                        disabled={isGroqLoading || isActionLoading}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={!userApiKey || isGroqLoading || isActionLoading}
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-4 px-6 pb-6">
              <div className="flex flex-row justify-center gap-4 w-full">
                <StoryButton
                  onClick={handleGenerate}
                  disabled={isGroqLoading || isActionLoading}
                  className="flex-1 text-lg"
                >
                  {isGroqLoading || isActionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Story"
                  )}
                </StoryButton>
                <NFTButton
                  onClick={handleGenerateAndMint}
                  disabled={isGroqLoading || isActionLoading}
                  className="flex-1 text-lg"
                >
                  {isGroqLoading || isActionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating NFT...
                    </>
                  ) : (
                    "Generate NFT"
                  )}
                </NFTButton>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPrompt('');
                    setTitle('');
                    setMainCharacters('');
                    setPlotOutline('');
                    setSetting('');
                    setThemes('');
                    setGeneratedContent('');
                  }}
                  disabled={isGroqLoading || isActionLoading}
                  className="flex-1 border-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full font-semibold py-3 text-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-300"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Reset
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
            </CardFooter>
          </Card>

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
                  {generatedContent ? <div dangerouslySetInnerHTML={{ __html: generatedContent }} /> : <p>No content generated yet.</p>}
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
                  {/* No buttons here as they have been moved to Creativity Settings */}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="nft" className="space-y-4 mt-4">
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
          ) : !isMinting && storyFormat === 'nft' ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Switch to Monad Network</h3>
              <p className="text-muted-foreground mb-4">
                You need to switch to the Monad network to mint NFTs
              </p>
              <Button 
                onClick={switchToMonadNetwork}
                className="theme-gradient-bg"
                disabled={isGroqLoading || isActionLoading}
              >
                {isGroqLoading ? (
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
                  <PrimaryAnimatedButton 
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
                  </PrimaryAnimatedButton>
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
              
              <NFTButton
                onClick={handleMintNFT}
                disabled={isMinting}
                className="w-full"
                animationType="pulse"
              >
                {isMinting ? (
                    <motion.div 
                      className="flex items-center justify-center space-x-2"
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
                      <span>
                        {storyFormat === 'nft' ? 'Minting NFT...' : 'Publishing...'}
                      </span>
                    </motion.div>
                ) : (
                  storyFormat === 'nft' ? 'Mint as NFT' : 'Publish Story'
                )}
              </NFTButton>
              
              <div className="text-xs text-muted-foreground">
                {storyFormat === 'nft' 
                  ? 'By minting this NFT, you confirm that you have the rights to this content and agree to the terms of service.'
                  : 'By publishing this story, you confirm that you have the rights to this content and agree to the terms of service.'}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 