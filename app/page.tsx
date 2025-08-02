"use client";

import React from "react";


import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  PenSquare, 
  Wallet
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TrendingStories } from "@/components/trending-stories";
import { FeaturedCreators } from "@/components/featured-creators";
import { GalaxyBackground } from "@/components/galaxy-background";

export default function Home() {
  const { account, connectWallet } = useWeb3();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col relative">
      {/* Add the galaxy background */}
      <GalaxyBackground />

      {/* Updated overlay with reduced opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-blue-950/80 pointer-events-none" />

      {/* Wrap all content in a relative container for proper z-indexing */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent [text-shadow:_0_1px_30px_rgb(255_255_255_/_20%)]">
                  Create, Mint & Share AI-Generated Stories
                </h1>

                <p className="text-lg md:text-xl text-white/90">
                  GroqTales turns your ideas into unique stories with the power of AI. Own your creations as NFTs on the Monad blockchain.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/create/ai-story">
                    <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/20">
                      <PenSquare className="mr-2 h-5 w-5" />
                      Create Story
                    </Button>
                  </Link>

                  {!account ? (
                    <Button 
                      onClick={connectWallet}
                      variant="outline" 
                      size="lg"
                      className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                    >
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </Button>
                  ) : (
                    <Link href="/nft-gallery">
                      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/20">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Browse NFTs
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="lg:w-1/2">
                <div className="relative group">
                  {/* Premium NFT Card */}
                  <div className="relative bg-black/20 rounded-xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-[1px] transition-all duration-500 group-hover:scale-[1.02] group-hover:border-white/20">
                    {/* Featured NFT Image */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image 
                        src="https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800&auto=format&fit=crop&q=80" 
                        alt="Featured NFT Story - The Quantum Dreamer" 
                        width={800} 
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Add floating particles effect */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1)_0%,rgba(0,0,0,0)_100%)] mix-blend-screen" />
                      <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
                    </div>

                    {/* NFT Info with enhanced styling */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary">Featured NFT #001</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white via-primary-foreground to-blue-200 bg-clip-text text-transparent">
                        The Quantum Dreamer
                      </h3>
                      <p className="text-sm text-white/80">
                        A mind-bending journey through parallel universes where dreams and reality intertwine.
                      </p>
                    </div>

                    {/* Glow effects */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Updated NFT Gallery section */}
        <section className="py-16 bg-black/20 backdrop-blur-[1px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Featured NFT Stories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse through unique AI-generated stories minted as NFTs on the blockchain
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Link href={`/nft-gallery/${i + 1}`} key={i}>
                  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={`https://via.placeholder.com/600x400?text=NFT+Story+${i + 1}`}
                        alt={`Featured NFT ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-xl">
                        {[ "The Digital Dreamer", "Echoes of Tomorrow", "Chronicles of the Forgotten" ][i]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {[ "A sci-fi adventure in a virtual world", "Post-apocalyptic survival story", "Fantasy tale of ancient magic" ][i]}
                      </p>
                    </div>
                    <div className="p-4 pt-0 flex justify-between">
                      <span className="text-sm flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 text-primary" />
                        NFT #{i + 101}
                      </span>
                      <span className="text-sm">
                        By @{[ "neuralink", "stargazer", "cryptobard" ][i]}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/nft-gallery">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600">
                  View All NFT Stories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Stories Section */}
        <TrendingStories />

        {/* Featured Creators Section */}
        <FeaturedCreators />

        {/* Updated How It Works section */}
        <section className="py-16 bg-black/20 backdrop-blur-[1px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                How GroqTales Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From idea to blockchain in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Create Your Story",
                  description: "Choose your genre, set parameters, and let our AI craft a unique story based on your inputs"
                },
                {
                  title: "Mint as NFT",
                  description: "Turn your story into a valuable NFT with a single click and store it permanently on the blockchain"
                },
                {
                  title: "Share & Trade",
                  description: "Share your creation with the world and trade it on supported NFT marketplaces"
}
              ].map((step, i) => (
                <div key={i} className="border-2 border-muted/50 bg-background/50 rounded-lg p-6 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-4 rounded-full bg-muted/30">
                      {[<PenSquare key="pen" className="h-12 w-12 text-cyan-500" />, 
                        <Sparkles key="sparkles" className="h-12 w-12 text-teal-500" />, 
                        <BookOpen key="book" className="h-12 w-12 text-emerald-500" />][i]}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/create/ai-story">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Updated CTA section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 backdrop-blur-[1px]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Ready to Create Your Own AI Story NFT?
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                Join the GroqTales community today and transform your ideas into unique stories powered by Groq's advanced AI
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/create/ai-story">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-emerald-500">
                    Get Started Now
                  </Button>
                </Link>

                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}