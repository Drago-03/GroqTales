#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing final critical syntax errors...\n');

// Specific files with known issues
const criticalFiles = [
  'components/splash-screen.tsx',
  'components/story-analysis.tsx',
  'components/providers/web3-provider.tsx',
];

function fixCriticalFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    const originalContent = content;

    console.log(`🔍 Processing ${filePath}...`);

    // Fix motion import issues - ensure framer-motion is imported
    if (
      content.includes('<motion.') &&
      !content.includes('import { motion }')
    ) {
      const importIndex = content.indexOf('import');
      if (importIndex !== -1) {
        const firstImportLine = content.indexOf('\n', importIndex);
        content =
          content.slice(0, firstImportLine + 1) +
          'import { motion } from "framer-motion";\n' +
          content.slice(firstImportLine + 1);
        modified = true;
        console.log(`  ✅ Added missing motion import`);
      }
    }

    // Fix interface definition issues - ensure proper TypeScript syntax
    if (filePath.includes('story-analysis.tsx')) {
      // Fix malformed interface property definitions
      content = content.replace(
        /(\s+)\/\*\*([^*]|\*(?!\/))*\*\/\s*(\w+\??):\s*string;/g,
        (match, indent, comment, prop) => {
          return `${indent}/** ${comment.replace(/\/\*\*|\*\//g, '').trim()} */\n${indent}${prop}: string;`;
        }
      );

      // Fix any remaining malformed comment patterns
      content = content.replace(
        /\/\*\*\s*([^*]|\*(?!\/))*\*\/\s*(\w+\??)\s*:\s*string;/g,
        '/** $1 */\n  $2: string;'
      );

      modified = true;
      console.log(`  ✅ Fixed interface definition syntax`);
    }

    // Fix missing closing braces in web3-provider
    if (filePath.includes('web3-provider.tsx')) {
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        const diff = openBraces - closeBraces;
        content += '\n' + '}'.repeat(diff);
        modified = true;
        console.log(`  ✅ Added ${diff} missing closing braces`);
      }
    }

    // General fixes for all files

    // Fix misplaced 'use client' directives
    if (content.match(/import.*?\n['"]use client['"];/)) {
      content = content.replace(
        /(import.*?\n)['"]use client['"];(\s*\n)/,
        '"use client";\n\n$1$2'
      );
      modified = true;
      console.log(`  ✅ Fixed misplaced 'use client' directive`);
    }

    // Fix unterminated block comments
    const unteriminatedComments = content.match(
      /\/\*\*[^*]*(?:\*(?!\/)[^*]*)*$/gm
    );
    if (unteriminatedComments) {
      content = content.replace(/\/\*\*[^*]*(?:\*(?!\/)[^*]*)*$/gm, '');
      modified = true;
      console.log(`  ✅ Removed unterminated block comments`);
    }

    // Fix malformed JSDoc comments in interface definitions
    content = content.replace(
      /\/\*\*\s*([^*]|\*(?!\/))*\s*(\w+\??)\s*:\s*string;/g,
      '/** $1 */\n  $2: string;'
    );

    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`  💾 Updated ${filePath}\n`);
      return true;
    } else {
      console.log(`  ℹ️  No changes needed for ${filePath}\n`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process critical files
let totalFixed = 0;
for (const file of criticalFiles) {
  if (fixCriticalFile(file)) {
    totalFixed++;
  }
}

console.log(`✨ Fixed critical syntax errors in ${totalFixed} files`);
console.log('🚀 Ready to test build again!');
