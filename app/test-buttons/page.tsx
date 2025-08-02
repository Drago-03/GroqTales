'use client';

import React from 'react';

import AIStoryGenerator from '@/components/ai-story-generator';

/**
 * Renders a page featuring a heading and the AIStoryGenerator component within a styled container.
 *
 * Displays a centered title and includes the AIStoryGenerator for interactive story generation.
 */
export default function TestButtonsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center gradient-heading">
        AI Story Generator with Animated Buttons
      </h1>
      <AIStoryGenerator />
    </div>
  );
}
