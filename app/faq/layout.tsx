import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'FAQ | GroqTales',
  description:
    'Frequently asked questions about GroqTales - Learn about story creation, NFTs, wallet setup, and more',
  openGraph: {
    title: 'FAQ | GroqTales',
    description:
      'Find answers to common questions about GroqTales, from getting started to advanced features',
    type: 'website',
    images: [
      {
        url: '/og-faq.jpg', // You can add your own Open Graph image
        width: 1200,
        height: 630,
        alt: 'GroqTales FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | GroqTales',
    description:
      'Find answers to common questions about GroqTales, from getting started to advanced features',
  },
};

/**
 * Serves as a layout wrapper for the FAQ page, rendering its child content without modification.
 *
 * @param children - The content to be displayed within the FAQ layout
 */
export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
