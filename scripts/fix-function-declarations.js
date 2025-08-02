#!/usr/bin/env node

/**
 * Comprehensive Function Declaration Fix Script for GroqTales
 * 
 * This script fixes all remaining function declaration issues including:
 * - Missing function keywords in function declarations
 * - Malformed export function syntax
 * - Broken function parameter declarations
 * - Missing imports for motion components
 */

const fs = require('fs');
const path = require('path');

class FunctionDeclarationFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Fixing all function declaration issues...\n');
    
    try {
      await this.fixAllFiles();
      this.printSummary();
      console.log('✅ Function declaration fixes completed!');
    } catch (error) {
      console.error('❌ Error during function declaration fix:', error.message);
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

      // Fix 1: Missing function keyword after closing brace
      // Pattern: } FunctionName({ params }: { types }) {
      const pattern1 = /}\s+(\w+)\(\s*\{([^}]*)\}\s*:\s*\{([^}]*)\}\s*\)\s*\{/g;
      if (pattern1.test(content)) {
        content = content.replace(pattern1, '}\n\nfunction $1({ $2 }: { $3 }) {');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 2: Missing function keyword with simple parameters
      // Pattern: } FunctionName({ param }: { type }) {
      const pattern2 = /}\s+(\w+)\(\s*\{([^}]+)\}\s*:\s*\{([^}]+)\}\s*\)\s*\{/g;
      if (pattern2.test(content)) {
        content = content.replace(pattern2, '}\n\nfunction $1({ $2 }: { $3 }) {');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 3: Missing function keyword without parameters
      // Pattern: } FunctionName() {
      const pattern3 = /}\s+(\w+)\(\s*\)\s*\{/g;
      if (pattern3.test(content)) {
        content = content.replace(pattern3, '}\n\nfunction $1() {');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 4: Missing function keyword at start of line
      // Pattern: FunctionName({ params }: { types }) {
      const lines = content.split('\n');
      const fixedLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Check for function-like patterns that are missing the function keyword
        const functionPattern = /^(\s*)([A-Z]\w+)\(\s*(\{[^}]*\}\s*:\s*\{[^}]*\}|\{[^}]*\}|[^)]*)\s*\)\s*\{/;
        const match = line.match(functionPattern);
        
        if (match && !line.includes('export') && !line.includes('const') && !line.includes('let') && !line.includes('var') && !line.includes('=')) {
          // Check if this looks like a React component or function declaration
          const functionName = match[2];
          if (functionName[0] === functionName[0].toUpperCase()) {
            // This looks like a component or function that needs the function keyword
            line = line.replace(functionPattern, '$1function $2($3) {');
            hasChanges = true;
            this.stats.errorsFixed++;
          }
        }
        
        fixedLines.push(line);
      }
      
      if (hasChanges) {
        content = fixedLines.join('\n');
      }

      // Fix 5: Remove orphaned comment fragments
      const orphanedComments = [
        /^\s*\*\/\s*$/gm,  // Standalone */
        /^\s*\*\s*@\w+[^\n]*$/gm,  // Orphaned JSDoc tags
      ];

      orphanedComments.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, '');
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      });

      // Fix 6: Add missing imports for motion components
      if (content.includes('<motion.') && !content.includes('framer-motion')) {
        const importMatch = content.match(/^import[^;]+;$/m);
        if (importMatch) {
          const insertIndex = content.indexOf(importMatch[0]) + importMatch[0].length;
          content = content.slice(0, insertIndex) + '\nimport { motion } from "framer-motion";' + content.slice(insertIndex);
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      }

      // Fix 7: Ensure proper React imports for JSX
      if ((content.includes('<') || content.includes('React.')) && !content.includes('import React') && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
        content = 'import React from "react";\n' + content;
        hasChanges = true;
        this.stats.errorsFixed++;
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
    console.log('\n📊 Function Declaration Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the function declaration fixer if called directly
if (require.main === module) {
  const fixer = new FunctionDeclarationFixer();
  fixer.run().catch(console.error);
}

module.exports = FunctionDeclarationFixer;
