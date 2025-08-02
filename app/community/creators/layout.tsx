import React from 'react';

import { metadata } from './metadata';

export { metadata };

/**
 * Renders the provided child elements without modification.
 *
 * @param children - The React nodes to be rendered
 * @returns The `children` prop as-is
 */
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
