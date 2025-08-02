/**
 * @fileoverview Core application functionality
 * @module components.ui.skeleton.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

import { cn } from '@/lib/utils';

  /**
   * Implements Skeleton functionality
   * 
   * @function Skeleton
   * @returns {void|Promise<void>} Function return value
   */


function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
