#!/usr/bin/env node

/**
 * Script to fix common linting warnings in the GroqTales project
 * Addresses console statements, formatting issues, and code quality improvements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting lint warning fixes...');

// Step 1: Run Prettier to fix formatting issues
console.log('📝 Running Prettier to fix formatting...');
try {
  execSync('npm run format', { stdio: 'inherit' });
  console.log('✅ Prettier formatting completed');
} catch (error) {
  console.log('⚠️ Prettier formatting had some issues, continuing...');
}

// Step 2: Fix common ESLint issues automatically
console.log('🔍 Running ESLint auto-fix...');
try {
  execSync('npm run lint:fix', { stdio: 'inherit' });
  console.log('✅ ESLint auto-fix completed');
} catch (error) {
  console.log('⚠️ ESLint auto-fix had some issues, continuing...');
}

// Step 3: Replace console.log with proper logging in development files
console.log('🔇 Replacing console statements with proper logging...');

const filesToProcess = [
  'components/providers/web3-provider.tsx',
  'hooks/use-web3-auth.ts',
  'utils/ipfs.ts',
  'lib/groq-service.ts',
  'lib/notification.ts',
];

filesToProcess.forEach((filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Replace console.log with conditional logging
      content = content.replace(
        /console\.log\(/g,
        'if (process.env.NODE_ENV === "development") console.log('
      );

      // Replace console.error with conditional logging
      content = content.replace(
        /console\.error\(/g,
        'if (process.env.NODE_ENV === "development") console.error('
      );

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed console statements in ${filePath}`);
    } catch (error) {
      console.log(`⚠️ Could not process ${filePath}: ${error.message}`);
    }
  }
});

console.log('🎉 Lint warning fixes completed!');
console.log('📊 Run "npm run build" to verify improvements');
