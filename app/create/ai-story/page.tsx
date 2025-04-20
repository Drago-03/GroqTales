"use client";

import { AIStoryGenerator } from "@/components/ai-story-generator";
import { Sparkles, BookText, Wallet, NetworkIcon } from "lucide-react";

export default function AIStoryGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
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
        
        <AIStoryGenerator />
        
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
    </div>
  );
} 