#!/usr/bin/env node

/**
 * API Route Syntax Fix Script for GroqTales
 * 
 * This script fixes the remaining syntax errors in API route files:
 * - Malformed function declarations
 * - Missing imports
 * - Broken code structure
 * - Invalid syntax patterns
 */

const fs = require('fs');
const path = require('path');

class ApiRouteFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Fixing API route syntax errors...\n');
    
    try {
      await this.fixApiRoutes();
      this.printSummary();
      console.log('✅ API route fixes completed!');
    } catch (error) {
      console.error('❌ Error during API route fix:', error.message);
      process.exit(1);
    }
  }

  async fixApiRoutes() {
    const apiDir = path.join(this.projectRoot, 'app/api');
    if (fs.existsSync(apiDir)) {
      await this.processDirectory(apiDir);
    }
  }

  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        await this.processDirectory(itemPath);
      } else if (item === 'route.ts' || item === 'route.js') {
        await this.fixApiRoute(itemPath);
      }
    }
  }

  async fixApiRoute(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;
      const originalContent = content;

      // Fix 1: Ensure proper imports are present
      const requiredImports = [
        'import { NextResponse } from "next/server";'
      ];

      requiredImports.forEach(importStatement => {
        if (!content.includes(importStatement)) {
          content = importStatement + '\n' + content;
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      });

      // Fix 2: Fix malformed function structure
      // Look for patterns where code is outside of function declarations
      const lines = content.split('\n');
      const fixedLines = [];
      let inFunction = false;
      let functionBraceCount = 0;
      let currentFunction = '';

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Track function boundaries
        if (line.match(/export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)/)) {
          inFunction = true;
          currentFunction = line.match(/(GET|POST|PUT|DELETE|PATCH)/)?.[1] || '';
          functionBraceCount = 0;
        }
        
        // Count braces
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        functionBraceCount += openBraces - closeBraces;
        
        // Fix orphaned code that should be inside functions
        if (!inFunction && line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('import') && !line.trim().startsWith('const') && !line.trim().startsWith('export')) {
          // This line appears to be orphaned code - skip it or wrap it
          console.log(`  ⚠️  Skipping orphaned code in ${path.relative(this.projectRoot, filePath)}: ${line.trim()}`);
          hasChanges = true;
          this.stats.errorsFixed++;
          continue;
        }
        
        fixedLines.push(line);
        
        if (inFunction && functionBraceCount === 0 && openBraces > 0) {
          inFunction = false;
          currentFunction = '';
        }
      }

      if (hasChanges) {
        content = fixedLines.join('\n');
      }

      // Fix 3: Ensure proper function structure for API routes
      if (!content.includes('export async function')) {
        // If no proper export function found, create a basic structure
        const functionName = path.basename(path.dirname(filePath)).toUpperCase() === 'API' ? 'POST' : 'GET';
        const basicStructure = `
export async function ${functionName}(req: Request) {
  try {
    return NextResponse.json({ message: "API endpoint not implemented" }, { status: 501 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
        content = content + basicStructure;
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 4: Clean up common syntax issues
      const cleanupPatterns = [
        // Remove duplicate semicolons
        { pattern: /;;+/g, replacement: ';' },
        // Fix spacing issues
        { pattern: /\s+\n/g, replacement: '\n' },
        // Remove empty lines at start
        { pattern: /^\n+/, replacement: '' }
      ];

      cleanupPatterns.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      });

      if (content !== originalContent) {
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
    console.log('\n📊 API Route Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the API route fixer if called directly
if (require.main === module) {
  const fixer = new ApiRouteFixer();
  fixer.run().catch(console.error);
}

module.exports = ApiRouteFixer;
