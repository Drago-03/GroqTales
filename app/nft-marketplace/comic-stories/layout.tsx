import React from 'react';
/**
 * Provides a layout container for comic stories pages, rendering its children within a vertically oriented, full-height section.
 *
 * @param children - The content to display inside the layout section
 */
export default function ComicStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex min-h-screen flex-col">{children}</section>;
}
