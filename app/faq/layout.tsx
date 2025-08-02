/**
 * @fileoverview Core application functionality
 * @module app.faq.layout.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | GroqTales",
  description: "Frequently asked questions about GroqTales - Learn about story creation, NFTs, wallet setup, and more",
  openGraph: {
    title: "FAQ | GroqTales",
    description: "Find answers to common questions about GroqTales, from getting started to advanced features",
    type: "website",
    images: [
      {
        url: "/og-faq.jpg", // You can add your own Open Graph image
        width: 1200,
        height: 630,
        alt: "GroqTales FAQ"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | GroqTales",
    description: "Find answers to common questions about GroqTales, from getting started to advanced features",
  }
};

export default   /**
   * Implements FaqLayout functionality
   * 
   * @function FaqLayout
   * @returns {void|Promise<void>} Function return value
   */
 function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 