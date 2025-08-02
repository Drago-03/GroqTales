'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import CommunityFeed from '@/components/community-feed';
import LoadingScreen from '@/components/loading-screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Displays the community hub page with a loading screen before showing the main content.
 *
 * Shows a loading indicator for one second, then transitions to the community feed with a fade-in animation.
 */
export default function CommunityPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Loading community hub..." />;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CommunityFeed />
    </motion.div>
  );
}
