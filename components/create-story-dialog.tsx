"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  Image as ImageIcon,
  PenSquare,
  Sparkles,
  FileText,
  Camera,
  Palette,
  BookMarked
} from "lucide-react";

interface CreateStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type StoryType = 'text' | 'image' | 'comic' | 'art';
type StoryFormat = 'nft' | 'free';

const genres = [
  { value: 'science-fiction', label: 'Science Fiction' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'horror', label: 'Horror' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'historical', label: 'Historical' }
];

export function CreateStoryDialog({ isOpen, onClose }: CreateStoryDialogProps) {
  const [step, setStep] = useState(1);
  const [storyType, setStoryType] = useState<StoryType | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [format, setFormat] = useState<StoryFormat | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const resetAndClose = () => {
    setStep(1);
    setStoryType(null);
    setGenre(null);
    setFormat(null);
    onClose();
  };

  const handleContinue = () => {
    if (step === 1 && !storyType) {
      toast({
        title: "Please select a story type",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !genre) {
      toast({
        title: "Please select a genre",
        variant: "destructive",
      });
      return;
    }

    if (step === 3 && !format) {
      toast({
        title: "Please select a format",
        variant: "destructive",
      });
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Navigate to create page with parameters
      const params = new URLSearchParams({
        type: storyType!,
        genre: genre!,
        format: format!
      });
      resetAndClose();
      router.push(`/create?${params.toString()}`);
    }
  };

  const renderStoryTypeSelection = () => (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant={storyType === 'text' ? 'default' : 'outline'}
        className="h-32 flex flex-col items-center justify-center gap-2"
        onClick={() => setStoryType('text')}
      >
        <FileText className="h-8 w-8" />
        <span>Text Story</span>
        <span className="text-xs text-muted-foreground">Pure written content</span>
      </Button>

      <Button
        variant={storyType === 'image' ? 'default' : 'outline'}
        className="h-32 flex flex-col items-center justify-center gap-2"
        onClick={() => setStoryType('image')}
      >
        <Camera className="h-8 w-8" />
        <span>Story with Images</span>
        <span className="text-xs text-muted-foreground">Text with illustrations</span>
      </Button>

      <Button
        variant={storyType === 'comic' ? 'default' : 'outline'}
        className="h-32 flex flex-col items-center justify-center gap-2"
        onClick={() => setStoryType('comic')}
      >
        <BookMarked className="h-8 w-8" />
        <span>Comic Story</span>
        <span className="text-xs text-muted-foreground">Sequential art narrative</span>
      </Button>

      <Button
        variant={storyType === 'art' ? 'default' : 'outline'}
        className="h-32 flex flex-col items-center justify-center gap-2"
        onClick={() => setStoryType('art')}
      >
        <Palette className="h-8 w-8" />
        <span>Art Story</span>
        <span className="text-xs text-muted-foreground">Visual storytelling</span>
      </Button>
    </div>
  );

  const renderGenreSelection = () => (
    <div className="space-y-4">
      <Label htmlFor="genre">Select Genre</Label>
      <Select value={genre || ''} onValueChange={setGenre}>
        <SelectTrigger id="genre">
          <SelectValue placeholder="Choose a genre" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((g) => (
            <SelectItem key={g.value} value={g.value}>
              {g.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderFormatSelection = () => (
    <div className="space-y-4">
      <Label>Select Format</Label>
      <RadioGroup
        value={format || ''}
        onValueChange={(value: string) => setFormat(value as StoryFormat)}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="nft"
            id="nft"
            className="peer sr-only"
          />
          <Label
            htmlFor="nft"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Sparkles className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="font-medium leading-none">NFT Story</p>
              <p className="text-sm text-muted-foreground">
                Mint as an NFT for sale
              </p>
            </div>
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value="free"
            id="free"
            className="peer sr-only"
          />
          <Label
            htmlFor="free"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <BookOpen className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="font-medium leading-none">Free Story</p>
              <p className="text-sm text-muted-foreground">
                Share with everyone
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Story</DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose the type of story you want to create"}
            {step === 2 && "Select a genre for your story"}
            {step === 3 && "Choose how you want to share your story"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === 1 && renderStoryTypeSelection()}
          {step === 2 && renderGenreSelection()}
          {step === 3 && renderFormatSelection()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : resetAndClose()}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          <Button onClick={handleContinue}>
            {step < 3 ? 'Continue' : 'Create Story'}
          </Button>
        </div>

        {/* Step indicator */}
        <div className="absolute top-2 right-2 flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full ${
                s === step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 