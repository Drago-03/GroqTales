"use client";

import { motion } from "framer-motion";
import { Sparkles, BookText, Cpu } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LoadingScreen({ 
  message = "Loading...", 
  fullScreen = false,
  size = "md"
}: LoadingScreenProps) {
  // Size configurations
  const sizes = {
    sm: {
      container: "h-20",
      icon: "w-6 h-6",
      text: "text-sm",
      orbit: "w-16 h-16"
    },
    md: {
      container: "h-32",
      icon: "w-8 h-8",
      text: "text-base",
      orbit: "w-24 h-24"
    },
    lg: {
      container: "h-48",
      icon: "w-10 h-10",
      text: "text-lg",
      orbit: "w-32 h-32"
    }
  };

  const currentSize = sizes[size];
  
  return (
    <div className={`
      flex flex-col items-center justify-center
      ${fullScreen ? "fixed inset-0 z-50 bg-background" : "w-full py-8"}
    `}>
      <div className={`relative ${currentSize.orbit}`}>
        {/* Central element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-primary/20 dark:bg-primary/10 rounded-full p-3"
          >
            <BookText className={`text-primary ${currentSize.icon}`} />
          </motion.div>
        </div>
        
        {/* Orbiting elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear"
          }}
          className="absolute inset-0"
        >
          {/* Top dot */}
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(147, 51, 234, 0.2)",
                "0 0 0 4px rgba(147, 51, 234, 0.2)",
                "0 0 0 0 rgba(147, 51, 234, 0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-purple-500 w-2 h-2 rounded-full" />
          </motion.div>
          
          {/* Bottom element */}
          <motion.div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="bg-blue-500/80 w-3 h-3 rounded-md flex items-center justify-center">
              <Cpu className="w-2 h-2 text-white" />
            </div>
          </motion.div>
          
          {/* Left element */}
          <motion.div 
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <div className="bg-amber-500/80 w-3 h-3 rounded-full" />
          </motion.div>
          
          {/* Right element */}
          <motion.div 
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          >
            <div className="bg-emerald-500/80 w-3 h-3 rounded-md flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {message && (
        <div className="mt-4">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-muted-foreground ${currentSize.text}`}
          >
            {message}
          </motion.p>
          
          <motion.div 
            className="mt-2 w-full h-1 bg-muted/30 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-primary/60 via-blue-400/60 to-primary/60"
              animate={{ 
                x: ["-100%", "100%"],
                backgroundPosition: ["0% 0%", "100% 0%"] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              style={{ width: "50%", backgroundSize: "200% 100%" }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default LoadingScreen; 