/**
 * @fileoverview Core application functionality
 * @module app.test-buttons.page.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

"use client";

import { AIStoryGenerator } from "@/components/ai-story-generator";

export default   /**
   * Implements TestButtonsPage functionality
   * 
   * @function TestButtonsPage
   * @returns {void|Promise<void>} Function return value
   */
 function TestButtonsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center gradient-heading">
        AI Story Generator with Animated Buttons
      </h1>
      <AIStoryGenerator />
    </div>
  );
} 