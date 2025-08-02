import React from "react";
"use client"

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/components/providers/web3-provider";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, ChevronDown, Copy, ExternalLink, Coins, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowDropdown(!showDropdown)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowDropdown(!showDropdown);
}
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-haspopup="true"
              aria-expanded={showDropdown ? "true" : "false"}
            >
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>{formatAddress(account)}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connected to {networkName || "Ethereum"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dropdown component separate from trigger */}
      <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
        {/* Hidden trigger to satisfy the component's requirements */}
        <DropdownMenuTrigger className="sr-only" aria-hidden="true">
          Open menu
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuItem onClick={copyAddressToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Address
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copyTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>

          <DropdownMenuItem onClick={disconnectWallet}>
            <div className="text-red-500 flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Disconnect
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}