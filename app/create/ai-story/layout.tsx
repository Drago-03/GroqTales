import React from 'react';

import { metadata } from './metadata';

export { metadata };

/**
 * Layout component that renders its child elements without modification.
 *
 * @param children - The content to be rendered within the layout
 * @returns The provided `children` elements
 */
export default function AIStoryGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
