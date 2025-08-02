"use client";

import { type ReactNode } from "react";
// removed actual import - we're using our mock instead
// import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

// Let's make our own provider that's just a wrapper for now
/**
 * A mock provider component that renders its children without modification.
 *
 * Serves as a placeholder for the actual MiniKit provider in client-side rendering setups.
 *
 * @param children - The React nodes to render within the provider
 */
function MockMiniKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Wraps child components with the `MockMiniKitProvider` for client-side rendering.
 *
 * Serves as a placeholder provider component, currently using a mock implementation without additional logic.
 *
 * @param props - Contains the child elements to be wrapped
 * @returns The children wrapped in a `MockMiniKitProvider`
 */
export function Providers(props: { children: ReactNode }) {
  return <MockMiniKitProvider>{props.children}</MockMiniKitProvider>;
}
