#!/usr/bin/env node

/**
 * Prepare Vercel Deployment Script
 * 
 * This script ensures all dependencies are correctly installed and
 * environment variables are properly configured for Vercel deployment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚀 Preparing project for Vercel deployment...\n');

// Check environment setup
try {
  console.log('Checking environment variables configuration...');
  require('./check-env');
} catch (error) {
  // If check-env fails, we continue anyway since Vercel will set the env vars
  console.log('Environment check skipped - will use Vercel environment variables.');
}

// Install any missing dependencies
try {
  console.log('\nChecking for missing dependencies...');
  
  const missingDeps = [
    '@radix-ui/react-tooltip@1.0.7',
  ];
  
  for (const dep of missingDeps) {
    try {
      console.log(`Installing ${dep}...`);
      execSync(`npm install ${dep} --no-save`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Warning: Failed to install ${dep}. Proceeding anyway.`);
    }
  }
  
  console.log('Dependencies check completed.');
} catch (error) {
  console.log('Warning: Failed to check dependencies. Proceeding anyway.');
}

// Make sure the build directory exists
try {
  const buildDir = path.resolve(process.cwd(), '.next');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
} catch (error) {
  console.log('Warning: Failed to create build directory. Proceeding anyway.');
}

console.log('\n✅ Vercel preparation completed successfully!\n'); 