/**
 * @fileoverview Core application functionality
 * @module components.nft-badge.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

  /**
   * Implements NFTBadge functionality
   * 
   * @function NFTBadge
   * @returns {void|Promise<void>} Function return value
   */


export function NFTBadge({ level }: { level: number }) {
  const badgeColors = [
    "from-yellow-400 to-yellow-600", // Bronze
    "from-gray-400 to-gray-600",     // Silver
    "from-yelllow-500 to-yellow-700", // Gold
    "from-blue-400 to-blue-600",     // Diamond
    "from-purple-500 to-pink-600"    // Legendary
  ];

  const badgeText = [
    "Bronze Collector",
    "Silver Collector",
    "Gold Collector",
    "Diamond Collector",
    "Legendary Collector"
  ];

  const index = Math.min(Math.max(0, level - 1), 4);

  return (
    <motion.div 
      className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${badgeColors[index]} text-white text-sm font-bold nft-pulse`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Sparkles className="h-3 w-3" />
      {badgeText[index]}
    </motion.div>
  );
} 