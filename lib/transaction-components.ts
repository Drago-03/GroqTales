'use client';

import React, { 
  createContext, 
  useContext, 
  ReactNode, 
  useState, 
  useCallback,
  ButtonHTMLAttributes
} from 'react';

/**
 * Mock transaction components for development
 * These components simulate blockchain transaction functionality
 * without requiring actual blockchain connections.
 * 
 * @fileoverview Transaction components and types
 * @version 1.0.0
 * @author GroqTales Development Team
 * @since 2024-01-01
 * @lastModified 2024-01-15
 */

// Types and Interfaces
export interface TransactionError {
  message: string;
  code?: number;
}

export interface TransactionResponse {
  transactionReceipts: { 
    transactionHash: string;
    status?: boolean;
    gasUsed?: string;
    blockNumber?: number;
  }[];
  success: boolean;
  error?: string;
}

export interface TransactionProps {
  children: ReactNode;
  calls: { to: string; data: `0x${string}`; value: bigint }[];
  onSuccess?: (response: TransactionResponse) => void;
  onError?: (error: TransactionError) => void;
}

export interface TransactionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface TransactionToastProps {
  children: ReactNode;
  className?: string;
}

export interface TransactionToastActionProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export interface TransactionToastIconProps {
  className?: string;
}

export interface TransactionToastLabelProps {
  children: ReactNode;
  className?: string;
}

export interface TransactionStatusProps {
  children: ReactNode;
  className?: string;
}

export interface TransactionStatusActionProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface TransactionStatusLabelProps {
  children: React.ReactNode;
  className?: string;
}

// Context
export type TransactionContextType = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: TransactionError | null;
  response: TransactionResponse | null;
  execute: () => Promise<TransactionResponse | void>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Type guard for TransactionContextType
function isTransactionContextType(context: TransactionContextType | undefined): context is TransactionContextType {
  return context !== undefined;
}

// Provider Component
export function TransactionProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<TransactionError | null>(null);
  const [response, setResponse] = useState<TransactionResponse | null>(null);

  const execute = useCallback(async (calls: Array<{ to: string; data: `0x${string}`; value: bigint }> = []) => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);

    try {
      // Simulate API call or blockchain transaction
      const result = await new Promise<TransactionResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            transactionReceipts: [{
              transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              status: true,
              gasUsed: '21000',
            }],
            success: true,
          });
        }, 1500);
      });

      setResponse(result);
      setIsSuccess(true);
      return result;
    } catch (err) {
      const error: TransactionError = err instanceof Error 
        ? { message: err.message }
        : { message: 'Unknown error occurred' };
      setError(error);
      setIsError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue: TransactionContextType = {
    isLoading,
    isSuccess,
    isError,
    error,
    response,
    execute,
  };

  return React.createElement(
    TransactionContext.Provider,
    { value: contextValue },
    children
  );
}

// Transaction Component
export interface TransactionComponentProps {
  children: (props: {
    execute: (calls?: Array<{ to: string; data: `0x${string}`; value: bigint }>) => Promise<TransactionResponse | void>;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: TransactionError | null;
    response: TransactionResponse | null;
  }) => ReactNode;
  onSuccess?: (response: TransactionResponse) => void;
  onError?: (error: TransactionError) => void;
}

/**
 * Transaction component that provides transaction state and execution
 * to its children via render props.
 */
export function Transaction({
  children,
  onSuccess,
  onError,
}: TransactionComponentProps) {
  const context = useTransaction();
  const executeTransaction = context?.execute;

  if (!context) {
    throw new Error('Transaction context is not available');
  }

  const execute = useCallback(async (calls: { to: string; data: `0x${string}`; value: bigint }[] = []): Promise<TransactionResponse> => {
    try {
      const result = await executeTransaction(calls);
      if (result) {
        onSuccess?.(result);
        return result;
      }
      throw new Error('Transaction execution returned undefined');
    } catch (error) {
      onError?.(error as TransactionError);
      throw error;
    }
  }, [executeTransaction, onSuccess, onError]);

  return children({
    execute,
    isLoading: context.isLoading,
    isSuccess: context.isSuccess,
    isError: context.isError,
    error: context.error,
    response: context.response,
  });
}

/**
 * Hook to access the transaction context
 * @returns Transaction context with state and execute function
 * @throws Error if used outside of TransactionProvider
 */
export function useTransaction(): TransactionContextType {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}

// UI Components

/**
 * Button component for transaction actions
 */
export function TransactionButton({
  onClick, 
  disabled = false, 
  children, 
  className = '',
  type = 'button',
  ...rest
}: TransactionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Toast notification for transaction status
 */
export function TransactionToast({ children, className = '' }: TransactionToastProps) {
  return (
    <div className={`p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function TransactionToastAction({ 
  onClick, 
  children, 
  className = '' 
}: TransactionToastActionProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`text-sm font-medium ${className}`}
    >
      {children}
    </button>
  );
}

export function TransactionToastIcon({ className = '' }: TransactionToastIconProps) {
  return (
    <div className={`w-5 h-5 ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </div>
  );
}

export function TransactionToastLabel({ children, className = '' }: TransactionToastLabelProps) {
  return (
    <span className={`text-sm ${className}`}>
      {children}
    </span>
  );
}

export function TransactionStatus({ children, className = '' }: TransactionStatusProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {children}
    </div>
  );
}

export function TransactionStatusAction({ 
  onClick, 
  children, 
  className = '' 
}: TransactionStatusActionProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`text-sm font-medium ${className}`}
    >
      {children}
    </button>
  );
}

export function TransactionStatusLabel({ children, className = '' }: TransactionStatusLabelProps) {
  return (
    <span className={`text-sm ${className}`}>
      {children}
    </span>
  );
}
