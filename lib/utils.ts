/**
 * @fileoverview Utility functions and helpers
 * @module lib.utils.ts
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

  /**
   * Implements cn functionality
   * 
   * @function cn
   * @returns {void|Promise<void>} Function return value
   */


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

  /**
   * Implements truncateAddress functionality
   * 
   * @function truncateAddress
   * @returns {void|Promise<void>} Function return value
   */


export function truncateAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}
