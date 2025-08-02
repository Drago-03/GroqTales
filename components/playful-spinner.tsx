/**
 * @fileoverview Core application functionality
 * @module components.playful-spinner.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

  /**
   * Implements PlayfulSpinner functionality
   * 
   * @function PlayfulSpinner
   * @returns {void|Promise<void>} Function return value
   */


export function PlayfulSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="flex items-center justify-center"
    >
      <Loader2 className="h-8 w-8 colorful-icon" />
    </motion.div>
  );
} 