/**
 * @fileoverview Core application functionality
 * @module app.community.layout.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import { metadata } from "./metadata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export { metadata };

export default   /**
   * Implements CommunityLayout functionality
   * 
   * @function CommunityLayout
   * @returns {void|Promise<void>} Function return value
   */
 function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gradient-heading">Community</h1>
        <div className="flex space-x-2">
          <Link href="/community">
            <div className="px-4 py-2 rounded-md hover:bg-muted transition-colors">Main Feed</div>
          </Link>
          <Link href="/community/creators">
            <div className="px-4 py-2 rounded-md hover:bg-muted transition-colors">Creators</div>
          </Link>
        </div>
      </div>
      
      {children}
    </div>
  );
} 