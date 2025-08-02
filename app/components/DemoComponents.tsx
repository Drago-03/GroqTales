"use client";

import React from "react";


import { type ReactNode, useCallback, useMemo, useState } from "react";
// yo fam, we need this for checking if the wallet is connected n stuff
import { useAccount } from "@/lib/wagmi-mock";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * Renders a styled card component that can be either static or interactive.
 *
 * If an `onClick` handler is provided, the card is rendered as a button and supports keyboard activation via Enter or Space. Optionally displays a title and always renders its children within a padded container.
 *
 * @param title - Optional card header text
 * @param children - Content to display inside the card
 * @param className - Additional CSS classes for custom styling
 * @param onClick - Optional click handler to make the card interactive
 *
 * @returns The rendered card element
 */
function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
}
  };

  // Use a button for interactive elements or div for non-interactive
  const Element = onClick ? 'button' : 'div';

  return (
    <Element
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      type={onClick ? "button" as "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </Element>
  );
}