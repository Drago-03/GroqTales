/**
 * Transaction Components Library
 * 
 * Provides transaction handling components and utilities for Web3 interactions
 * in the GroqTales platform.
 */

import React from 'react';
import { toast } from '@/components/ui/use-toast';

/**
 * Transaction component for handling Web3 transactions
 */
export interface TransactionProps {
  children: React.ReactNode;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export const Transaction: React.FC<TransactionProps> = ({ 
  children, 
  onSuccess, 
  onError 
}) => {
  return (
    <div className="transaction-wrapper">
      {children}
    </div>
  );
};

/**
 * Transaction button component for submitting transactions
 */
export interface TransactionButtonProps {
  onClick?: () => Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = ""
}) => {
  const handleClick = async () => {
    if (onClick) {
      try {
        await onClick();
      } catch (error) {
        console.error('Transaction failed:', error);
        toast({
          title: "Transaction Failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`transaction-button ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * Transaction toast component for showing transaction notifications
 */
export interface TransactionToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const TransactionToast: React.FC<TransactionToastProps> = ({
  title,
  description,
  variant = 'default'
}) => {
  return (
    <div className={`transaction-toast ${variant}`}>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  );
};

/**
 * Transaction toast action component
 */
export interface TransactionToastActionProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const TransactionToastAction: React.FC<TransactionToastActionProps> = ({
  onClick,
  children
}) => {
  return (
    <button onClick={onClick} className="transaction-toast-action">
      {children}
    </button>
  );
};

/**
 * Transaction toast icon component
 */
export interface TransactionToastIconProps {
  type: 'success' | 'error' | 'pending';
}

export const TransactionToastIcon: React.FC<TransactionToastIconProps> = ({
  type
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📄';
    }
  };

  return (
    <span className="transaction-toast-icon">
      {getIcon()}
    </span>
  );
};

/**
 * Transaction toast label component
 */
export interface TransactionToastLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export const TransactionToastLabel: React.FC<TransactionToastLabelProps> = ({
  children,
  className = ""
}) => {
  return (
    <span className={`transaction-toast-label ${className}`}>
      {children || 'Transaction'}
    </span>
  );
};

/**
 * Transaction status type
 */
export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * Transaction error component
 */
export interface TransactionErrorProps {
  error?: Error | string;
  className?: string;
}

export const TransactionError: React.FC<TransactionErrorProps> = ({
  error,
  className = ""
}) => {
  const errorMessage = error instanceof Error ? error.message : error || 'Transaction failed';
  
  return (
    <div className={`transaction-error ${className}`}>
      <span className="error-message">{errorMessage}</span>
    </div>
  );
};

/**
 * Transaction response component
 */
export interface TransactionResponseProps {
  response?: any;
  className?: string;
}

export const TransactionResponse: React.FC<TransactionResponseProps> = ({
  response,
  className = ""
}) => {
  return (
    <div className={`transaction-response ${className}`}>
      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
};

/**
 * Transaction status action component
 */
export interface TransactionStatusActionProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const TransactionStatusAction: React.FC<TransactionStatusActionProps> = ({
  onClick,
  children,
  className = ""
}) => {
  return (
    <button onClick={onClick} className={`transaction-status-action ${className}`}>
      {children}
    </button>
  );
};

/**
 * Transaction status label component
 */
export interface TransactionStatusLabelProps {
  status?: TransactionStatus;
  children?: React.ReactNode;
  className?: string;
}

export const TransactionStatusLabel: React.FC<TransactionStatusLabelProps> = ({
  status = 'idle',
  children,
  className = ""
}) => {
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'success':
        return 'Success';
      case 'error':
        return 'Failed';
      default:
        return 'Ready';
    }
  };

  return (
    <span className={`transaction-status-label status-${status} ${className}`}>
      {children || getStatusText()}
    </span>
  );
};

/**
 * Transaction status component
 */
export interface TransactionStatusProps {
  status?: TransactionStatus;
  children?: React.ReactNode;
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status = 'idle',
  children,
  className = ""
}) => {
  return (
    <div className={`transaction-status ${className}`}>
      {children || <TransactionStatusLabel status={status} />}
    </div>
  );
};

/**
 * Transaction utilities
 */
export const TransactionUtils = {
  /**
   * Format transaction hash for display
   */
  formatTxHash: (hash: string): string => {
    if (hash.length <= 10) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  },

  /**
   * Get transaction explorer URL
   */
  getExplorerUrl: (hash: string, network: string = 'ethereum'): string => {
    const explorers = {
      ethereum: 'https://etherscan.io/tx/',
      polygon: 'https://polygonscan.com/tx/',
      base: 'https://basescan.org/tx/',
      arbitrum: 'https://arbiscan.io/tx/',
    };
    
    const baseUrl = explorers[network as keyof typeof explorers] || explorers.ethereum;
    return `${baseUrl}${hash}`;
  }
};
