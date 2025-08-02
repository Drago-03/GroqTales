#!/usr/bin/env node

/**
 * Quick API Route Fix Script for GroqTales
 * 
 * This script fixes the remaining critical syntax errors in API routes:
 * - Duplicate NextResponse imports
 * - Unterminated block comments
 * - Missing closing braces
 */

const fs = require('fs');
const path = require('path');

class QuickApiFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Quick API route fixes...\n');
    
    try {
      const apiFiles = [
        'app/api/notify/route.ts',
        'app/api/story-analysis/route.ts', 
        'app/api/story-recommendations/route.ts',
        'app/api/monad/route.ts',
        'app/admin/login/page.tsx'
      ];

      for (const file of apiFiles) {
        await this.fixFile(path.join(this.projectRoot, file));
      }
      
      this.printSummary();
      console.log('✅ Quick API fixes completed!');
    } catch (error) {
      console.error('❌ Error during quick API fix:', error.message);
      process.exit(1);
    }
  }

  async fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;

      // Fix 1: Remove duplicate NextResponse imports
      const lines = content.split('\n');
      const seenImports = new Set();
      const filteredLines = [];

      for (const line of lines) {
        if (line.includes('import') && line.includes('NextResponse')) {
          const importKey = line.trim();
          if (!seenImports.has(importKey)) {
            seenImports.add(importKey);
            filteredLines.push(line);
          } else {
            hasChanges = true;
            this.stats.errorsFixed++;
          }
        } else {
          filteredLines.push(line);
        }
      }

      content = filteredLines.join('\n');

      // Fix 2: Remove unterminated block comments
      content = content.replace(/,\s*\/\*\*\s*\n\s*export async function/g, '\n\nexport async function');
      content = content.replace(/}\s*\/\*\*\s*\n\s*export async function/g, '}\n\nexport async function');

      // Fix 3: Add missing closing braces
      let braceCount = 0;
      for (const char of content) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }

      while (braceCount > 0) {
        content += '\n}';
        braceCount--;
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      if (content !== fs.readFileSync(filePath, 'utf8')) {
        hasChanges = true;
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        console.log(`  🔧 Fixed ${path.relative(this.projectRoot, filePath)}`);
        this.stats.filesFixed++;
      }

    } catch (error) {
      console.warn(`  ⚠️  Could not process ${filePath}: ${error.message}`);
    }
  }

  printSummary() {
    console.log('\n📊 Quick API Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the quick API fixer if called directly
if (require.main === module) {
  const fixer = new QuickApiFixer();
  fixer.run().catch(console.error);
}

module.exports = QuickApiFixer;
