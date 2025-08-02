#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing remaining critical syntax errors...\n');

// Files with known critical syntax errors from build output
const criticalFiles = [
  'app/create/ai-story/metadata.ts',
  'components/community-feed.tsx',
  'components/loading-screen.tsx',
  'app/cookies/page.tsx',
];

let totalFixed = 0;

function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Fix unterminated block comments at the beginning of files
    if (content.match(/^import.*?\n\/\*\*\s*\n\s*\n/m)) {
      content = content.replace(/^(import.*?\n)\/\*\*\s*\n\s*\n/m, '$1');
      modified = true;
      console.log(`  ✅ Fixed unterminated block comment in ${filePath}`);
    }

    // Fix unterminated block comments after imports
    if (content.match(/\/\*\*\s*\n\s*\n(?!.*\*\/)/)) {
      content = content.replace(/\/\*\*\s*\n\s*\n/g, '');
      modified = true;
      console.log(`  ✅ Fixed unterminated block comment in ${filePath}`);
    }

    // Fix duplicate React imports
    if (
      content.match(
        /import React from "react";\s*\n.*import \* as React from 'react';/
      )
    ) {
      content = content.replace(/import React from "react";\s*\n/, '');
      modified = true;
      console.log(`  ✅ Fixed duplicate React import in ${filePath}`);
    }

    // Fix misplaced "use client" directives
    if (content.match(/import.*?\n"use client";/)) {
      content = content.replace(
        /(import.*?\n)"use client";/,
        '"use client";\n\n$1'
      );
      modified = true;
      console.log(`  ✅ Fixed misplaced "use client" directive in ${filePath}`);
    }

    // Fix malformed function declarations
    if (content.match(/\}\s+\w+\s+function\s+\w+\(/)) {
      content = content.replace(
        /(\})\s+(\w+)\s+(function\s+\w+\()/g,
        '$1\n\n// $2\n$3'
      );
      modified = true;
      console.log(`  ✅ Fixed malformed function declaration in ${filePath}`);
    }

    // Fix missing function keywords
    if (
      content.match(/\w+\([^)]*\)\s*\{/) &&
      !content.match(/function\s+\w+\([^)]*\)\s*\{/)
    ) {
      content = content.replace(/(\w+)\(([^)]*)\)\s*\{/g, 'function $1($2) {');
      modified = true;
      console.log(`  ✅ Fixed missing function keyword in ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      console.log(`  💾 Updated ${filePath}\n`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process critical files
criticalFiles.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  console.log(`🔍 Processing ${file}...`);
  fixFile(fullPath);
});

console.log(`\n✨ Fixed critical syntax errors in ${totalFixed} files`);
console.log('🚀 Ready to test build again!');
