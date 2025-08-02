import React from 'react';

import { metadata } from './metadata';

export { metadata };

/**
 * Layout component that renders its child elements as-is.
 *
 * @param children - The content to be displayed within the layout
 * @returns The provided `children` elements
 */
export default function NftGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
