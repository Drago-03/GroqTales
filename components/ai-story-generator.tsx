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
import { Loader2, Sparkles, BookText, CopyCheck, Wallet, Key } from "lucide-react";
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

export function AIStoryGenerator() {
  const { generate, generateIdeas, availableModels, defaultModel, isLoading: isGroqLoading, error: groqError, fetchModels } = useGroq();
  const { mintNFT, generateAndMint, isLoading: isMonadLoading, networkInfo, error: monadError, isOnMonadNetwork, switchToMonadNetwork } = useMonad();
  const { account } = useWeb3();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("science-fiction");
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNftUrl, setMintedNftUrl] = useState("");

  // Story outline fields
  const [mainCharacters, setMainCharacters] = useState("");
  const [plotOutline, setPlotOutline] = useState("");
  const [setting, setSetting] = useState("");
  const [themes, setThemes] = useState("");
  const [userApiKey, setUserApiKey] = useState("");
  const [isUsingCustomKey, setIsUsingCustomKey] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true);

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
- Genre: ${genre.replace(/-/g, ' ')}

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
      if (isUsingCustomKey && userApiKey.trim()) {
        customOptions = { apiKey: userApiKey };
      }

      setGeneratedContent(""); // Clear previous content
      
      const content = await generate(
        engineeredPrompt,
        selectedModel,
        { ...options, ...customOptions }
      );
      
      setGeneratedContent(content);
      
      // Extract title from first line if not provided
      if (!title) {
        const firstLine = content.split('\n')[0];
        const extractedTitle = firstLine.replace(/^#\s+/, '').replace(/^\s*Title:\s*/, '');
        setTitle(extractedTitle);
      }
      
      toast({
        title: "Story Generated",
        description: "Your AI story has been generated successfully",
      });
    } catch (error: any) {
      console.error("Error generating story:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate story",
        variant: "destructive",
      });
    }
  };

  // Handle generating a story and minting it as an NFT in one action
  const handleGenerateAndMint = async () => {
    if (!prompt && !plotOutline && !mainCharacters && !setting) {
      toast({
        title: "Input Required",
        description: "Please provide at least a brief story idea or outline",
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
      
      // Check if using custom API key for the generateAndMint call
      let customOptions = {};
      if (isUsingCustomKey && userApiKey.trim()) {
        customOptions = { apiKey: userApiKey };
      }
      
      const engineeredPrompt = constructPrompt();
      const result = await generateAndMint(engineeredPrompt, title, genre, customOptions);
      
      if (result) {
        setGeneratedContent(result.metadata.content);
        setTitle(result.metadata.title);
        setMintedNftUrl(`/nft/${result.tokenId}`);
        
        toast({
          title: "NFT Minted Successfully",
          description: `Your story has been generated and minted as NFT #${result.tokenId}`,
        });
      }
    } catch (error: any) {
      console.error("Error generating and minting story:", error);
      toast({
        title: "Mint Failed",
        description: error.message || "Failed to generate and mint story",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
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
        coverImage: `https://source.unsplash.com/random/800x600/?${genre}`,
        genre,
        createdAt: new Date().toISOString(),
        aiModel: selectedModel,
        aiPrompt: constructPrompt(),
        tags: [genre]
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

  return (
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
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Story</TabsTrigger>
            <TabsTrigger value="mint">Mint as NFT</TabsTrigger>
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
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={genre}
                onValueChange={setGenre}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="science-fiction">Science Fiction</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="historical-fiction">Historical Fiction</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                </SelectContent>
              </Select>
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
            
            <div className="flex flex-col space-y-4 mt-4">
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="theme-gradient-bg"
              >
                {isGroqLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Story
                  </>
                )}
              </Button>
              
              {account && (
                <Button
                  onClick={handleGenerateAndMint}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating & Minting...
                    </>
                  ) : (
                    <>
                      <CopyCheck className="mr-2 h-4 w-4" />
                      Generate & Mint in One Step
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {generatedContent && (
              <div className="mt-6 p-4 border rounded-md bg-muted/30">
                <h3 className="text-lg font-bold mb-2">{title || "Generated Story"}</h3>
                <div className="prose prose-sm max-w-none">
                  {generatedContent.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="mint" className="space-y-4 mt-4">
            {!account ? (
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
            ) : !isOnMonadNetwork ? (
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
                  Generate a story first before minting it as an NFT
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
                <h3 className="text-lg font-medium mb-2">NFT Minted Successfully!</h3>
                <p className="text-muted-foreground mb-4">
                  Your story has been successfully minted as an NFT on the Monad blockchain
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild className="theme-gradient-bg">
                    <Link href={mintedNftUrl}>
                      View Your NFT
                    </Link>
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
                    Genre: {genre.charAt(0).toUpperCase() + genre.slice(1).replace('-', ' ')}
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
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <CopyCheck className="mr-2 h-4 w-4" />
                      Mint as NFT
                    </>
                  )}
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  By minting this NFT, you confirm that you have the rights to this content and
                  agree to the terms of service.
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
      </CardFooter>
    </Card>
  );
} 