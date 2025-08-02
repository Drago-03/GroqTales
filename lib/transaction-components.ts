import React from 'react';

/**
 * Mock transaction components for development
 * These components simulate blockchain transaction functionality
 * without requiring actual blockchain connections.
 * 
 * @fileoverview Transaction component interfaces and types
 * @version 1.0.0
 * @author GroqTales Development Team
 * @since 2024-01-01
 * @lastModified 2024-01-15
 */
export interface TransactionProps {
  children: React.ReactNode;
  calls?: { to: string; data: `0x${string}`; value: bigint }[];
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Transaction button component props
 */
export interface TransactionButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Transaction toast component props
 */
export interface TransactionToastProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Transaction toast action props
 */
export interface TransactionToastActionProps {
  onClick?: () => void;
  children: React.ReactNode;
}

/**
 * Transaction toast icon props
 */
export interface TransactionToastIconProps {
  className?: string;
}

/**
 * Transaction toast label props
 */
export interface TransactionToastLabelProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Transaction status props
 */
export interface TransactionStatusProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Transaction status action props
 */
export interface TransactionStatusActionProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Transaction status label props
 */
export interface TransactionStatusLabelProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Transaction error type
 */
export interface TransactionError {
  message: string;
  code?: number;
}

/**
 * Transaction response type
 */
export interface TransactionResponse {
  transactionReceipts: Array<{
    transactionHash: string;
    status: string;
  }>;
}

// All component implementations are in transaction-components.tsx
// This file contains only TypeScript interface definitions
