"use client";

import * as React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Sparkles, 
  Skull, 
  Heart, 
  Rocket, 
  Compass, 
  LucideIcon,
  GraduationCap,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Genre = {
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
  description: string;
};

const genres: Genre[] = [
  {
    name: "Fantasy",
    slug: "fantasy",
    icon: Sparkles,
    color: "text-purple-500",
    description: "Magical worlds, mythical creatures, and epic adventures"
  },
  {
    name: "Sci-Fi",
    slug: "sci-fi",
    icon: Rocket,
    color: "text-blue-500",
    description: "Futuristic technology, space exploration, and alternate realities"
  },
  {
    name: "Horror",
    slug: "horror",
    icon: Skull,
    color: "text-red-700",
    description: "Terrifying tales, supernatural entities, and psychological terror"
  },
  {
    name: "Romance",
    slug: "romance",
    icon: Heart,
    color: "text-pink-500",
    description: "Love stories, relationships, and emotional journeys"
  },
  {
    name: "Adventure",
    slug: "adventure",
    icon: Compass,
    color: "text-amber-600",
    description: "Thrilling quests, exploration, and exciting challenges"
  },
  {
    name: "Historical",
    slug: "historical",
    icon: BookOpen,
    color: "text-yellow-800",
    description: "Stories set in past time periods with historical context"
  },
  {
    name: "Educational",
    slug: "educational",
    icon: GraduationCap,
    color: "text-green-600",
    description: "Informative stories that teach valuable lessons and facts"
  },
  {
    name: "Magical Realism",
    slug: "magical-realism",
    icon: Wand2,
    color: "text-teal-500",
    description: "Ordinary worlds with magical elements woven into reality"
  }
];

export function GenreCard({ genre }: { genre: Genre }) {
  return (
    <Link href={`/genres/${genre.slug}`} className="block group">
      <div className="bg-card hover:bg-accent transition-colors rounded-lg shadow p-6 h-full">
        <div className="flex items-center mb-4">
          <genre.icon className={cn("h-6 w-6 mr-2", genre.color)} />
          <h3 className="font-medium text-lg">{genre.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{genre.description}</p>
      </div>
    </Link>
  );
}

export function GenreSelector() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Explore Genres</h2>
        <Button variant="link" asChild>
          <Link href="/genres">View All</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.slice(0, 4).map((genre) => (
          <GenreCard key={genre.slug} genre={genre} />
        ))}
      </div>
    </div>
  );
}

export function GenresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Stories by Genre</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <GenreCard key={genre.slug} genre={genre} />
        ))}
      </div>
    </div>
  );
} 