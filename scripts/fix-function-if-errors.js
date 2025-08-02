#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing "function if" syntax errors...\n');

// Function to find all TypeScript and TSX files
function findAllFiles(dir, extensions = ['.ts', '.tsx']) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findAllFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to fix "function if" errors in a file
function fixFunctionIfErrors(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Fix "function if" patterns - these should just be "if"
    const functionIfPattern = /function if\s*\(/g;
    if (content.match(functionIfPattern)) {
      content = content.replace(functionIfPattern, 'if (');
      modified = true;
    }

    // Fix other malformed function patterns that might have been created
    const malformedPatterns = [
      /function while\s*\(/g,
      /function for\s*\(/g,
      /function switch\s*\(/g,
      /function try\s*\{/g,
      /function catch\s*\(/g,
      /function finally\s*\{/g
    ];

    malformedPatterns.forEach((pattern, index) => {
      const replacements = ['while (', 'for (', 'switch (', 'try {', 'catch (', 'finally {'];
      if (content.match(pattern)) {
        content = content.replace(pattern, replacements[index]);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Fixed "function if" errors in ${path.relative(process.cwd(), filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔍 Scanning for TypeScript/TSX files...');
const allFiles = findAllFiles(process.cwd(), ['.ts', '.tsx']);
console.log(`Found ${allFiles.length} files to process\n`);

let totalFixed = 0;

// Process all files
for (const file of allFiles) {
  if (fixFunctionIfErrors(file)) {
    totalFixed++;
  }
}

console.log(`\n✨ Fixed "function if" errors in ${totalFixed} files`);
console.log('🚀 Ready to test build again!');
