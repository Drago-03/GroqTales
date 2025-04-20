"use client";

import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  PenSquare, 
  Wallet, 
  ShieldCheck, 
  Zap,
  BookMarked,
  Globe
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { genres } from "@/components/genre-selector";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import * as React from "react";

// Animate in view component
function AnimateInView({ 
  children, 
  delay = 0
}: { 
  children: React.ReactNode, 
  delay?: number 
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { account, connectWallet } = useWeb3();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = async () => {
    if (!account) {
      await connectWallet();
    }
    router.push('/stories');
  };

  const createStory = () => {
    if (!account) {
      connectWallet();
      return;
    }
    router.push('/create');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 -z-10" />
        <div className="absolute inset-0 bg-grid-black/[0.03] -z-10" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateInView>
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  AI-Powered Storytelling Platform
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-heading">
                  Create & Share Amazing Stories
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Unleash your creativity with GroqTales. Write, illustrate, and even mint your stories as NFTs using cutting-edge AI tools.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button 
                    onClick={handleGetStarted} 
                    size="lg"
                    className="theme-gradient-bg"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={createStory}
                    variant="outline" 
                    size="lg"
                  >
                    <PenSquare className="mr-2 h-4 w-4" /> Create a Story
                  </Button>
                </div>
              </div>
            </AnimateInView>
            
            <AnimateInView delay={0.2}>
              <div className="relative p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20 -z-10" />
                <div className="relative bg-card overflow-hidden shadow-xl rounded-2xl border">
                  <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bg" />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-10 rounded-md bg-muted/50 w-3/4" />
                      <div className="h-24 rounded-md bg-muted/50" />
                      <div className="h-36 rounded-md bg-muted/50" />
                      <div className="h-10 rounded-md bg-muted/50 w-1/2 ml-auto" />
                    </div>
                  </div>
                  <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div className="h-8 w-24 rounded-md bg-primary/20" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <AnimateInView>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Storytelling Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create compelling narratives with our suite of storytelling tools, powered by Groq AI and blockchain technology.
              </p>
            </div>
          </AnimateInView>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimateInView delay={0.1}>
              <div className="bg-card p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
                <p className="text-muted-foreground">
                  Use Groq's powerful AI models to generate high-quality stories based on your ideas and prompts.
                </p>
              </div>
            </AnimateInView>
            
            <AnimateInView delay={0.2}>
              <div className="bg-card p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">NFT Minting</h3>
                <p className="text-muted-foreground">
                  Turn your stories into valuable NFTs on the Monad blockchain with just a few clicks.
                </p>
              </div>
            </AnimateInView>
            
            <AnimateInView delay={0.3}>
              <div className="bg-card p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Community</h3>
                <p className="text-muted-foreground">
                  Share your work with readers and writers worldwide and collaborate on creative projects.
                </p>
              </div>
            </AnimateInView>
            
            <AnimateInView delay={0.4}>
              <div className="bg-card p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-4">
                  <BookMarked className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                <p className="text-muted-foreground">
                  Create text stories, visual narratives, or comics - all supported by our versatile platform.
                </p>
              </div>
            </AnimateInView>
            
            <AnimateInView delay={0.5}>
              <div className="bg-card p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ownership Protection</h3>
                <p className="text-muted-foreground">
                  Secure your creative work with blockchain verification and provable ownership records.
                </p>
              </div>
            </AnimateInView>
            
            <AnimateInView delay={0.6}>
              <div className="bg-card p-6 rounded-xl border hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full theme-gradient-bg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast & Responsive</h3>
                <p className="text-muted-foreground">
                  Enjoy a smooth creation experience with our lightning-fast platform and intuitive interface.
                </p>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>
      
      {/* Popular Genres */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimateInView>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore Popular Genres</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover stories across multiple genres or create your own in your favorite category.
              </p>
            </div>
          </AnimateInView>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {genres.slice(0, 8).map((genre, index) => (
              <AnimateInView key={genre.slug} delay={0.1 * index}>
                <Link href={`/genres/${genre.slug}`}>
                  <div className="bg-card hover:bg-accent/10 border rounded-xl p-4 text-center transition-all hover:shadow-md">
                    <div className="flex justify-center mb-2">{genre.icon}</div>
                    <h3 className="font-medium">{genre.name}</h3>
                  </div>
                </Link>
              </AnimateInView>
            ))}
          </div>
          
          <AnimateInView delay={0.8}>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/genres">
                  View All Genres <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimateInView>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <AnimateInView>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of storytellers who are creating and sharing their work on GroqTales.
              </p>
            </div>
          </AnimateInView>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Fiction Writer",
                image: "/avatars/avatar-1.png",
                quote: "The AI story generation tool has transformed my creative process. I can now develop ideas in minutes that used to take days."
              },
              {
                name: "Maya Johnson",
                role: "Digital Artist",
                image: "/avatars/avatar-2.png",
                quote: "Being able to mint my visual stories as NFTs has opened up new revenue streams I never thought possible as an independent creator."
              },
              {
                name: "Jamal Peters",
                role: "Educator",
                image: "/avatars/avatar-3.png", 
                quote: "I use GroqTales with my students to teach creative writing. The platform's intuitive design makes storytelling accessible to everyone."
              }
            ].map((testimonial, index) => (
              <AnimateInView key={index} delay={0.2 * index}>
                <div className="bg-card p-6 rounded-xl border relative">
                  <div className="absolute -top-6 left-6">
                    <div className="bg-card p-1 rounded-full border shadow-sm">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          width={48} 
                          height={48}
                          className="object-cover" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6">
                    <p className="italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <AnimateInView>
            <div className="bg-card border rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 theme-gradient-bg" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              
              <div className="relative text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Creative Journey?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join our community of storytellers and bring your ideas to life with GroqTales.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button 
                    onClick={createStory} 
                    size="lg"
                    className="theme-gradient-bg"
                  >
                    Create Your First Story <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg"
                  >
                    <Link href="/stories">
                      <BookOpen className="mr-2 h-4 w-4" /> Explore Stories
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimateInView>
        </div>
      </section>
    </div>
  );
}