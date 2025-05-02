// This is a wrapper module to re-export transaction components from onchainkit
// Import the components directly from the main package
import * as OnchainKit from '@coinbase/onchainkit';

// Re-export the components we need
export const Transaction = OnchainKit.Transaction;
export const TransactionButton = OnchainKit.TransactionButton;
export const TransactionToast = OnchainKit.TransactionToast;
export const TransactionToastAction = OnchainKit.TransactionToastAction;
export const TransactionToastIcon = OnchainKit.TransactionToastIcon;
export const TransactionToastLabel = OnchainKit.TransactionToastLabel;
export const TransactionError = OnchainKit.TransactionError;
export const TransactionResponse = OnchainKit.TransactionResponse;
export const TransactionStatusAction = OnchainKit.TransactionStatusAction;
export const TransactionStatusLabel = OnchainKit.TransactionStatusLabel;
export const TransactionStatus = OnchainKit.TransactionStatus; 