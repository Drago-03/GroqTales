/**
 * @fileoverview Core application functionality
 * @module components.ui.collapsible.tsx
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
