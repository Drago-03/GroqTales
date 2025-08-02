/**
 * @fileoverview Core application functionality
 * @module app.test-buttons.layout.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default   /**
   * Implements TestButtonsLayout functionality
   * 
   * @function TestButtonsLayout
   * @returns {void|Promise<void>} Function return value
   */
 function TestButtonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-xl font-bold mx-auto">GroqTales Button Testing</h1>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 