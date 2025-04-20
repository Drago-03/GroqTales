#!/usr/bin/env node

/**
 * Tooltip Fallback Script
 * 
 * This script replaces the regular tooltip component with our fallback version
 * if the build fails due to missing @radix-ui/react-tooltip dependency.
 */

const fs = require('fs');
const path = require('path');

const tooltipPath = path.join(process.cwd(), 'components/ui/tooltip.tsx');
const fallbackPath = path.join(process.cwd(), 'components/ui/tooltip-fallback.tsx');

console.log('Checking if tooltip fallback is needed...');

// Check if we need to replace the tooltip component
if (fs.existsSync(tooltipPath) && fs.existsSync(fallbackPath)) {
  console.log('Both tooltip and fallback exist, checking content...');
  
  const tooltipContent = fs.readFileSync(tooltipPath, 'utf8');
  
  // Check if the tooltip contains a reference to @radix-ui/react-tooltip
  if (tooltipContent.includes('@radix-ui/react-tooltip')) {
    console.log('Found reference to @radix-ui/react-tooltip, backing up original...');
    
    // Backup the original tooltip component
    fs.writeFileSync(tooltipPath + '.backup', tooltipContent);
    
    // Replace with our fallback
    const fallbackContent = fs.readFileSync(fallbackPath, 'utf8');
    fs.writeFileSync(tooltipPath, fallbackContent);
    
    console.log('Successfully replaced tooltip with fallback version');
  } else {
    console.log('No reference to @radix-ui/react-tooltip found or already replaced');
  }
} else {
  if (!fs.existsSync(tooltipPath)) {
    console.log('Original tooltip component not found at', tooltipPath);
  }
  
  if (!fs.existsSync(fallbackPath)) {
    console.log('Fallback tooltip component not found at', fallbackPath);
  }
}

console.log('Tooltip fallback check completed'); 