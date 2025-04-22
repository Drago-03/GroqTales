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
  Globe,
  Shapes
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { genres } from "@/components/genre-selector";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import * as React from "react";
import { AIStoryGenerator } from "@/components/ai-story-generator";
import { TrendingStories } from "@/components/trending-stories";
import { FeaturedCreators } from "@/components/featured-creators";

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

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
    router.push('/create/ai-story');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
        className="relative py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center bg-background"
      >
        <motion.div
          variants={fadeIn}
          className="absolute inset-0 overflow-hidden -z-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.2),transparent_40%)]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
        </motion.div>
        
        <motion.div variants={fadeIn} className="max-w-3xl mx-auto">
          <motion.h1 
            variants={fadeIn}
            className="text-4xl font-extrabold tracking-tight gradient-heading sm:text-5xl md:text-6xl"
          >
            Immortalize Your Stories on the Blockchain
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="mt-6 text-xl text-muted-foreground"
          >
            Create, own, and share unique stories as NFTs on GroqTales. Connect with fellow creators in a decentralized storytelling ecosystem.
          </motion.p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button 
              size="lg" 
              className="theme-gradient-bg text-white border-0 shadow-md hover:shadow-xl hover:opacity-90 transition-all duration-300" 
              asChild
            >
              <Link href="/stories">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Stories
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              className="bg-primary text-white border-primary/20 hover:bg-primary/90 transition-all duration-300 shadow-md"
              onClick={() => {
                // Direct navigation using window.location for maximum reliability
                window.location.href = '/create/ai-story?source=home&format=free';
              }}
            >
              <PenSquare className="mr-2 h-5 w-5" />
              Create Story
            </Button>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-heading">
              A New Era of Digital Storytelling
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Combining the art of storytelling with blockchain technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              variants={fadeIn}
              className="relative p-6 bg-card rounded-xl shadow-sm border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Own Your Stories</h3>
              <p className="text-muted-foreground">
                Mint your stories as unique NFTs and truly own your creative work on the blockchain.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="relative p-6 bg-card rounded-xl shadow-sm border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
              <p className="text-muted-foreground">
                Use our Groq-powered AI tools to generate, enhance, and analyze your stories.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="relative p-6 bg-card rounded-xl shadow-sm border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shapes className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
              <p className="text-muted-foreground">
                Connect with other writers, collaborate on stories, and build a supportive network.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* AI Generator Demo */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-heading">
              Try Our AI Story Generator
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Experience the power of Groq's LLM to create unique story snippets
            </p>
          </div>
          
          <AIStoryGenerator />
        </div>
      </motion.section>

      {/* Trending Stories */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-heading">
              Trending Stories
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Discover the most popular stories on GroqTales
            </p>
          </div>
          
          <TrendingStories />
          
          <div className="mt-12 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <Link href="/stories">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View All Stories
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Creators */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-heading">
              Featured Creators
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Meet the brilliant minds behind our top stories
            </p>
          </div>
          
          <FeaturedCreators />
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5 border-t border-primary/10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-heading">
            Ready to Share Your Story?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Join our community of creators and immortalize your stories on the blockchain.
          </p>
          <Button 
            size="lg" 
            className="theme-gradient-bg text-white border-0 shadow-md hover:shadow-xl hover:opacity-90 transition-all duration-300"
            onClick={() => {
              // Direct navigation using window.location for maximum reliability
              window.location.href = '/create/ai-story?source=home&format=free';
            }}
          >
            <PenSquare className="mr-2 h-5 w-5" />
            Create Your First Story
          </Button>
        </motion.div>
      </motion.section>
    </div>
  );
}