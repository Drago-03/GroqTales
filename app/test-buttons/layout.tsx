import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

/**
 * Provides a layout with a navigation header and content area for button testing pages.
 *
 * Renders a header with a "Back to Home" button and a title, followed by a main section displaying the provided children.
 *
 * @param children - The content to display within the main area of the layout
 */
export default function TestButtonsLayout({
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
          <h1 className="text-xl font-bold mx-auto">
            GroqTales Button Testing
          </h1>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
