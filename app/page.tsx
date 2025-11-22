'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  PenSquare,
  Wallet,
  Zap,
  Star,
  Rocket,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { FeaturedCreators } from '@/components/featured-creators';
import { useWeb3 } from '@/components/providers/web3-provider';
import { TrendingStories } from '@/components/trending-stories';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { account, connectWallet } = useWeb3();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col relative bg-yellow-50 overflow-hidden">
      {/* Comic Halftone Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-24 border-b-8 border-black bg-yellow-400 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-white border-4 border-black px-6 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2"
              >
                <span className="font-black text-xl md:text-2xl text-black uppercase tracking-widest">
                  The Future of Storytelling
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-black text-black uppercase leading-none [text-shadow:4px_4px_0px_#fff,8px_8px_0px_#000]"
              >
                Create <br />
                <span className="text-white [text-shadow:4px_4px_0px_#000]">
                  Mint
                </span>{' '}
                <br />& Share
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-black border-l-8 border-black pl-6 py-4 bg-white/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Unleash your imagination with AI. Turn your stories into
                valuable NFTs on the Monad blockchain.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <Link href="/create/ai-story">
                  <Button
                    size="lg"
                    className="bg-red-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all text-xl font-black uppercase px-8 py-6 h-auto rounded-none"
                  >
                    <PenSquare className="mr-3 h-6 w-6" />
                    Start Creating
                  </Button>
                </Link>

                {!account && (
                  <Button
                    onClick={connectWallet}
                    size="lg"
                    className="bg-white text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all text-xl font-black uppercase px-8 py-6 h-auto rounded-none"
                  >
                    <Wallet className="mr-3 h-6 w-6" />
                    Connect Wallet
                  </Button>
                )}
              </motion.div>
            </div>

            <div className="lg:w-1/2 relative">
              <motion.div
                animate={{ rotate: [2, -2, 2] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <div className="bg-white border-8 border-black p-4 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                  <div className="aspect-square relative overflow-hidden border-4 border-black bg-blue-400">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Rocket className="w-32 h-32 text-white animate-bounce" />
                    </div>
                    {/* Comic Speech Bubble */}
                    <div className="absolute -top-6 -right-6 bg-white border-4 border-black px-6 py-4 rounded-[50%] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20">
                      <span className="font-black text-2xl text-black">
                        BOOM!
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t-4 border-black pt-4">
                    <h3 className="text-3xl font-black uppercase">
                      AI Powered
                    </h3>
                    <p className="font-bold text-lg">
                      Generate stories in seconds!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <Star className="absolute top-0 right-0 w-12 h-12 text-yellow-400 fill-current stroke-black stroke-2 animate-spin-slow" />
              <Zap className="absolute bottom-0 left-0 w-16 h-16 text-blue-500 fill-current stroke-black stroke-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-4 [text-shadow:4px_4px_0px_#000] text-white stroke-black text-stroke-2">
              Why GroqTales?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Generation',
                desc: 'Powered by Groq for lightning-fast story creation.',
                icon: <Zap className="w-12 h-12" />,
                color: 'bg-cyan-300',
              },
              {
                title: 'NFT Ownership',
                desc: 'Your stories are truly yours on the blockchain.',
                icon: <Wallet className="w-12 h-12" />,
                color: 'bg-magenta-300',
              },
              {
                title: 'Community',
                desc: 'Read, share, and trade with other creators.',
                icon: <Sparkles className="w-12 h-12" />,
                color: 'bg-green-300',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className={`${feature.color} border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="bg-white border-4 border-black w-20 h-20 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black uppercase mb-4">
                  {feature.title}
                </h3>
                <p className="text-xl font-bold border-l-4 border-black pl-4 bg-white/50 py-2">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-pink-100 border-b-8 border-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black uppercase bg-white border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              Trending Now
            </h2>
            <Link href="/nft-gallery">
              <Button className="bg-black text-white border-4 border-transparent hover:bg-gray-800 font-bold uppercase">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <TrendingStories />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 border-b-8 border-black text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase mb-8 [text-shadow:6px_6px_0px_#000]">
            Ready to Start?
          </h2>
          <Link href="/create/ai-story">
            <Button className="bg-yellow-400 text-black border-4 border-black text-2xl font-black uppercase px-12 py-8 h-auto shadow-[12px_12px_0px_0px_#fff] hover:shadow-[16px_16px_0px_0px_#fff] hover:-translate-y-1 transition-all rounded-none">
              Create Your Story
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
