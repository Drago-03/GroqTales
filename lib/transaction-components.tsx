/**

"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Mock TransactionResponse and TransactionError types
export type TransactionResponse = {
  transactionReceipts: { transactionHash: string }[];
};

export type TransactionError = {
  message: string;
  code?: number;
};

// Create a context for transaction state
type TransactionContextType = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: TransactionError | null;
  response: TransactionResponse | null;
  execute: () => Promise<TransactionResponse | void>;
};

const TransactionContext = createContext<TransactionContextType>({
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  response: null,
  execute: async () => {},
});

// Transaction component props
type TransactionProps = {
  children: ReactNode;
  calls: { to: string; data: `0x${string}`; value: bigint }[];
  onSuccess?: (response: TransactionResponse) => void;
  onError?: (error: TransactionError) => void;
};

// Main Transaction component

export function Transaction({ children, calls, onSuccess, onError }: TransactionProps) {
  // Mock implementation
  const execute = async () => {
    // Simulate transaction
    console.log("Executing transaction with calls:", calls);

    try {
      // Mock successful transaction after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = {
        transactionReceipts: [
          { transactionHash: `0x${Math.random().toString(16).slice(2)}` }
        ]
      };

      if (onSuccess) onSuccess(response);
      return response;
    } catch (error) {
      const txError = { message: "Transaction failed", code: 4001 };
      if (onError) onError(txError);
      throw txError;
}
  };

  const value = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    response: null,
    execute,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
// Hook to use transaction context
const useTransaction = () => useContext(TransactionContext);

// Transaction Button
type TransactionButtonProps = {
  className?: string;
  children?: ReactNode;
};

  export function TransactionToastAction() {
  const { isSuccess } = useTransaction();

  if (isSuccess) {
    return (
      <button className="ml-2 text-sm text-blue-500 hover:text-blue-700">
        View
      </button>
    );
}
  return null;
}