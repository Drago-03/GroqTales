/**
 * @fileoverview Core application functionality
 * @module components.client-only.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

'use client';

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

  /**
   * Implements ClientOnly functionality
   * 
   * @function ClientOnly
   * @returns {void|Promise<void>} Function return value
   */


export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default ClientOnly;
