import React from "react";
/**

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenSquare, Camera, Palette, BookText, Coins, BookOpen, ChevronLeft } from "lucide-react";
import { genres } from "@/components/genre-selector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface CreateStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
interface CreateOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}
const createOptions: CreateOption[] = [
  {
    id: "ai",
    title: "AI Story",
    description: "Create a story with AI assistance",
    icon: <BookText className="w-5 h-5" />,
    path: "/create/ai-story"
  },
  {
    id: "text",
    title: "Text Story",
    description: "Create a story with your own writing",
    icon: <PenSquare className="w-5 h-5" />,
    path: "/create"
  },
  {
    id: "image",
    title: "Image Story",
    description: "Create a story with images",
    icon: <Camera className="w-5 h-5" />,
    path: "/create"
}
];

  export function CreateStoryDialog({ isOpen, onClose }: CreateStoryDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFormat, setSelectedFormat] = useState<string>("free");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const router = useRouter();

  const handleOptionSelect = (option: CreateOption) => {
    setSelectedOption(option.id);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
    setSelectedOption(null);
  };

  const handleFormatChange = (value: string) => {
    setSelectedFormat(value);
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    // Create a path based on the selections
    let path = "/create";

    if (selectedOption === "ai") {
      path = "/create/ai-story";
}
    try {
      // Store the selection in localStorage with stringified JSON
      const storyData = {
        type: selectedOption,
        format: selectedFormat,
        genre: selectedGenre,
        timestamp: new Date().getTime()
      };

      // Store to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('storyCreationData', JSON.stringify(storyData));

        // Verify the data was saved correctly
        const savedData = localStorage.getItem('storyCreationData');
        if (!savedData) {
          throw new Error("Failed to save story creation data");
}
}
      console.log("Story creation data saved successfully:", storyData);

      // Close the dialog first to avoid UI issues
      onClose();

      // Force a slight delay to ensure the dialog is closed
      // and localStorage is updated before navigation
      setTimeout(() => {
        console.log("Navigating to:", path);
        // Use router.push with { forceOptimisticNavigation: true } for more reliable navigation
        router.push(path);
      }, 100); // Increased delay for more reliability
    } catch (error) {
      console.error("Error saving data or navigating:", error);
      // Show an error through toast notification if available
      if (typeof window !== 'undefined') {
        alert("Error creating story. Please try again.");
}
      // Try direct navigation as fallback
      if (typeof window !== 'undefined') {
        window.location.href = path;
}
}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === 2 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 mr-1" 
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <PenSquare className="w-5 h-5" />
            {currentStep === 1 ? "Create Story" : "Story Details"}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="grid gap-4 py-4">
            {createOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full h-auto p-4 justify-start gap-4 hover:bg-accent/10 transition-colors ${
                  selectedOption === option.id ? 'border-primary' : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {option.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </Button>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium">Story Format</h3>
              <RadioGroup 
                defaultValue={selectedFormat} 
                onValueChange={handleFormatChange}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="flex flex-col cursor-pointer">
                    <span className="font-medium">Free Story</span>
                    <span className="text-xs text-muted-foreground">Available to all readers</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10">
                  <RadioGroupItem value="nft" id="nft" />
                  <Label htmlFor="nft" className="flex flex-col cursor-pointer">
                    <span className="font-medium">NFT Story</span>
                    <span className="text-xs text-muted-foreground">Create as digital asset</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Choose Genre</h3>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                {genres.map((genre) => (
                  <div 
                    key={genre.slug}
                    onClick={() => handleGenreChange(genre.slug)} 
                    className={`border rounded-md p-3 cursor-pointer hover:bg-accent/10 flex items-center space-x-2 ${
                      selectedGenre === genre.slug ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div>{genre.icon}</div>
                    <span>{genre.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <DialogFooter>
            <Button
              onClick={handleContinue}
              disabled={!selectedGenre}
              className="w-full theme-gradient-bg text-white"
            >
              Continue to Editor
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}