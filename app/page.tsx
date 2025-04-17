"use client";

import { StoryFeed } from "@/components/story-feed";
import { GenreSelector } from "@/components/genre-selector";
import { CreateStoryButton } from "@/components/create-story-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Sparkles } from "lucide-react";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingAnimation } from "@/components/loading-animation";

export default function Home() {
  const { account } = useWeb3();
  const router = useRouter();

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!account) {
      router.push('/landing');
    }
  }, [account, router]);

  if (!account) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingAnimation message="Redirecting to landing page" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 px-6 rounded-xl theme-gradient-bg bg-opacity-10 border animated-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-heading">
            Welcome to GroqTales
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create and discover AI-powered stories on the blockchain. Join our community of storytellers and readers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CreateStoryButton />
            <Button variant="outline" asChild>
              <Link href="/stories" className="flex items-center">
                Explore Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Genre Section */}
      <section className="relative">
        <div className="absolute inset-0 theme-gradient-bg opacity-5 rounded-xl -z-10"></div>
        <div className="py-8 px-4">
          <GenreSelector />
        </div>
      </section>

      {/* Community Section */}
      <section className="theme-gradient-bg bg-opacity-5 rounded-xl p-8 border">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold gradient-heading mb-4">Join Our Community</h2>
          <p className="text-lg text-muted-foreground">
            Connect with fellow writers, share your stories, and engage with a vibrant community of storytellers.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card p-6 rounded-lg shadow-sm border card-glow">
            <div className="theme-gradient-bg p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share & Connect</h3>
            <p className="text-muted-foreground mb-4">Post updates, share your writing process, and connect with other creators.</p>
            <Button variant="link" className="p-0" asChild>
              <Link href="/community" className="flex items-center gradient-heading">
                Visit Community
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border card-glow">
            <div className="theme-gradient-bg p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Inspired</h3>
            <p className="text-muted-foreground mb-4">Discover trending stories, find inspiration, and stay updated with the latest creations.</p>
            <Button variant="link" className="p-0" asChild>
              <Link href="/stories" className="flex items-center gradient-heading">
                Explore Stories
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border card-glow">
            <div className="theme-gradient-bg p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Indie Hub Collab</h3>
            <p className="text-muted-foreground mb-4">Exclusive resources and support for independent creators through our Indie Hub partnership.</p>
            <Button variant="link" className="p-0" asChild>
              <Link href="/indie-hub" className="flex items-center gradient-heading">
                Learn More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button className="theme-gradient-bg text-white border-0 hover:opacity-90" asChild>
            <Link href="/community">
              <Users className="mr-2 h-4 w-4" />
              Explore Community
            </Link>
          </Button>
        </div>
      </section>

      {/* Story Feed Section */}
      <section>
        <StoryFeed />
      </section>
    </div>
  );
}