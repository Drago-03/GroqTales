/**
 * @fileoverview Core application functionality
 * @module app.types.global.d.ts
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
    };
  }
}

export {}; 