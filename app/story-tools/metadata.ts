/**
 * @fileoverview Core application functionality
 * @module app.story-tools.metadata.ts
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Story Tools | GroqTales",
  description: "Use Groq's powerful AI to analyze, summarize, and get recommendations for your stories",
  openGraph: {
    title: "AI Story Tools | GroqTales",
    description: "Use Groq's powerful AI to analyze, summarize, and get recommendations for your stories",
    type: "website",
    images: [
      {
        url: "/og-story-tools.jpg",
        width: 1200,
        height: 630,
        alt: "GroqTales AI Story Tools"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Story Tools | GroqTales",
    description: "Use Groq's powerful AI to analyze, summarize, and get recommendations for your stories",
  }
}; 