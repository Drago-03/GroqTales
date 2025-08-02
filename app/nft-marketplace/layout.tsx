import React from 'react';
/**
 * Provides a full-width layout container for the NFT marketplace, rendering its child components within.
 *
 * @param children - The content to be displayed inside the layout
 */
export default function NFTMarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}
