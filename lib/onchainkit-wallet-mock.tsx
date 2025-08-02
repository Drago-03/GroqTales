"use client";

import React, { useState } from "react";

interface WalletProps {
  children: React.ReactNode;
  className?: string;
}}
      </div>
      {open && (
        <div className={`absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${className}`}>
          {children}
        </div>
      )}
    </>
  );
}
interface WalletDropdownDisconnectProps {
  className?: string;
}
  export function WalletDropdownDisconnect({ className = "" }: WalletDropdownDisconnectProps) {
  const handleDisconnect = () => {
    console.log("wallet disconnected, gg no re");
  };

  return (
    <button 
      onClick={handleDisconnect}
      className={`w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
    >
      Disconnect
    </button>
  );
}