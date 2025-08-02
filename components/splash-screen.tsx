"use client";

import React from "react";


import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Wand2 } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
  minDisplayTime?: number; // minimum time to display in ms
}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full theme-gradient-bg flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Orbiting NFT elements */}
              <motion.div
                animate={{ 
                  rotate: 360
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-0"
              >
                <motion.div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-primary/80 w-6 h-6 rounded-md flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                >
                  <div className="bg-purple-500/80 w-6 h-6 rounded-md flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
                >
                  <div className="bg-blue-500/80 w-6 h-6 rounded-md flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L3 18H21L12 4Z" fill="currentColor" />
                    </svg>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.9 }}
                >
                  <div className="bg-amber-500/80 w-6 h-6 rounded-md flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold gradient-heading"
              >
                GroqTales
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative h-6 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTitleIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-muted-foreground absolute inset-0 text-center"
                  >
                    {bookTitles[currentTitleIndex]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full"
            >
              <div className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-primary/60 via-blue-400/60 to-primary/60"
                  animate={{ 
                    x: ["-100%", "100%"],
                    backgroundPosition: ["0% 0%", "100% 0%"] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default SplashScreen; 