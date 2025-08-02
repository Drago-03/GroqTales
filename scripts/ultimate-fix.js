#!/usr/bin/env node

/**
 * Ultimate Syntax Fix Script for GroqTales
 * 
 * This script performs a comprehensive fix of all remaining syntax issues:
 * - Missing function declarations
 * - Malformed code structure
 * - Broken imports and exports
 * - Invalid JSX/TSX syntax
 */

const fs = require('fs');
const path = require('path');

class UltimateSyntaxFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Performing ultimate syntax fixes...\n');
    
    try {
      await this.fixAllFiles();
      this.printSummary();
      console.log('✅ Ultimate syntax fixes completed!');
    } catch (error) {
      console.error('❌ Error during ultimate syntax fix:', error.message);
      process.exit(1);
    }
  }

  async fixAllFiles() {
    const dirs = ['app', 'components', 'lib', 'hooks', 'src'];
    
    for (const dir of dirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        await this.processDirectory(dirPath);
      }
    }
  }

  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        await this.processDirectory(itemPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.jsx')) {
        await this.fixFile(itemPath);
      }
    }
  }

  async fixFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;
      const originalContent = content;

      // Fix 1: Reconstruct broken files by parsing line by line
      const lines = content.split('\n');
      const fixedLines = [];
      let inFunction = false;
      let braceCount = 0;
      let currentFunction = '';

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Skip empty lines and comments at the start
        if (!line.trim() && fixedLines.length === 0) continue;
        
        // Fix broken function declarations
        if (line.match(/^\s*function\s+\w+\s*\(/)) {
          inFunction = true;
          currentFunction = line.match(/function\s+(\w+)/)?.[1] || '';
          braceCount = 0;
        }
        
        // Count braces to track function boundaries
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceCount += openBraces - closeBraces;
        
        // Fix malformed function calls that should be declarations
        const malformedFunctionMatch = line.match(/^(\s*)(\w+)\(\s*([^)]*)\s*\)\s*\{/);
        if (malformedFunctionMatch && !line.includes('export') && !line.includes('const') && !line.includes('=')) {
          const [, indent, funcName, params] = malformedFunctionMatch;
          // Only fix if it looks like a component (starts with capital) or is clearly a function
          if (funcName[0] === funcName[0].toUpperCase() || i > 0) {
            line = `${indent}function ${funcName}(${params}) {`;
            hasChanges = true;
            this.stats.errorsFixed++;
          }
        }
        
        // Fix broken imports/exports
        if (line.includes('} from') && line.includes(';') && line.includes('function')) {
          const parts = line.split(';');
          if (parts.length > 1) {
            fixedLines.push(parts[0] + ';');
            const remaining = parts.slice(1).join(';').trim();
            if (remaining) {
              const functionMatch = remaining.match(/(\w+)\s*\(/);
              if (functionMatch) {
                line = `function ${remaining}`;
                hasChanges = true;
                this.stats.errorsFixed++;
              }
            } else {
              continue;
            }
          }
        }
        
        // Remove orphaned comment fragments
        if (line.match(/^\s*\*\/\s*$/) || line.match(/^\s*\*\s*@\w+/)) {
          hasChanges = true;
          this.stats.errorsFixed++;
          continue;
        }
        
        fixedLines.push(line);
        
        if (inFunction && braceCount === 0 && openBraces > 0) {
          inFunction = false;
          currentFunction = '';
        }
      }

      if (hasChanges) {
        content = fixedLines.join('\n');
      }

      // Fix 2: Ensure proper imports for React components
      if (content.includes('<') && !content.includes('import React') && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
        content = 'import React from "react";\n' + content;
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 3: Add missing framer-motion imports
      if (content.includes('<motion.') && !content.includes('framer-motion')) {
        const importIndex = content.indexOf('\n');
        if (importIndex > -1) {
          content = content.slice(0, importIndex) + '\nimport { motion } from "framer-motion";' + content.slice(importIndex);
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      }

      // Fix 4: Clean up malformed code patterns
      const cleanupPatterns = [
        // Remove standalone closing braces with spaces
        { pattern: /^\s*\}\s*$/gm, replacement: '}' },
        // Fix double semicolons
        { pattern: /;;+/g, replacement: ';' },
        // Remove empty lines with just spaces
        { pattern: /^\s+$/gm, replacement: '' },
        // Fix malformed export statements
        { pattern: /export\s+(\w+)\s*\(/g, replacement: 'export function $1(' }
      ];

      cleanupPatterns.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      });

      // Fix 5: Validate and fix basic syntax issues
      try {
        // Basic validation - check for unmatched braces
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        
        if (openBraces !== closeBraces) {
          console.log(`  ⚠️  Brace mismatch in ${path.relative(this.projectRoot, filePath)}: ${openBraces} open, ${closeBraces} close`);
        }
      } catch (error) {
        // Ignore validation errors for now
      }

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
    console.log('\n📊 Ultimate Syntax Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the ultimate syntax fixer if called directly
if (require.main === module) {
  const fixer = new UltimateSyntaxFixer();
  fixer.run().catch(console.error);
}

module.exports = UltimateSyntaxFixer;
