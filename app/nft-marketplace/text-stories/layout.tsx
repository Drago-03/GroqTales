import React from 'react';
/**
 * Provides a full-height, vertically stacked layout for text story content.
 *
 * Renders its children inside a section element with flexbox styling for columnar arrangement and minimum screen height.
 *
 * @param children - The content to display within the layout
 */
export default function TextStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex min-h-screen flex-col">{children}</section>;
}
