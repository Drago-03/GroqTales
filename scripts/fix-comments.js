#!/usr/bin/env node

/**
 * Comprehensive Comment Fix Script for GroqTales
 * 
 * This script fixes all remaining comment-related syntax errors including:
 * - Unterminated block comments
 * - Malformed JSDoc comments
 * - Comments breaking function declarations
 */

const fs = require('fs');
const path = require('path');

class CommentFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Fixing all comment-related syntax errors...\n');
    
    try {
      await this.fixAllFiles();
      this.printSummary();
      console.log('✅ Comment fixes completed!');
    } catch (error) {
      console.error('❌ Error during comment fix:', error.message);
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

      // Fix 1: Remove unterminated block comments that break syntax
      // Pattern: /**\n     *\n   export function
      const unterminatedPattern = /\/\*\*\s*\n\s*\*\s*\n\s*export\s+function/g;
      if (unterminatedPattern.test(content)) {
        content = content.replace(unterminatedPattern, 'export function');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 2: Remove malformed JSDoc that appears before function declarations
      // Pattern: /**\n     *\n   function or /**\n     *\n   export
      const malformedJSDocPattern = /\/\*\*\s*\n\s*\*\s*\n\s*(export\s+)?(function|const|let|var)/g;
      if (malformedJSDocPattern.test(content)) {
        content = content.replace(malformedJSDocPattern, '$1$2');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 3: Remove orphaned /** comments that don't close properly
      const orphanedCommentPattern = /\/\*\*\s*\n\s*\*\s*$/gm;
      if (orphanedCommentPattern.test(content)) {
        content = content.replace(orphanedCommentPattern, '');
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 4: Fix broken function declarations with missing closing braces
      // Look for functions that end with just } instead of proper closing
      const lines = content.split('\n');
      const fixedLines = [];
      let inFunction = false;
      let braceCount = 0;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Track function starts
        if (line.match(/^\s*(export\s+)?(function|const\s+\w+\s*=)/)) {
          inFunction = true;
          braceCount = 0;
        }
        
        // Count braces
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceCount += openBraces - closeBraces;
        
        // Fix lines that are just "} " (space after brace)
        if (line.trim() === '}' && i === lines.length - 1) {
          // This is likely the end of file, keep it as is
        } else if (line.match(/^\s*\}\s*$/)) {
          line = line.replace(/^\s*\}\s*$/, '}');
        }
        
        fixedLines.push(line);
        
        if (inFunction && braceCount === 0 && openBraces > 0) {
          inFunction = false;
        }
      }

      const newContent = fixedLines.join('\n');
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 5: Remove any remaining malformed comment patterns
      const patterns = [
        // Pattern: ,   /** at start of line
        /^\s*,\s*\/\*\*[\s\S]*?\*\//gm,
        // Pattern: Standalone /** without proper closing
        /^\s*\/\*\*\s*\n(?!\s*\*[\s\S]*?\*\/)/gm,
        // Pattern: Comments in the middle of code lines
        /(\w+)\s*\/\*\*[\s\S]*?\*\/\s*(\w+)/g
      ];

      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          if (pattern.source.includes('(\\w+)')) {
            // For patterns with capture groups, preserve the words
            content = content.replace(pattern, '$1 $2');
          } else {
            content = content.replace(pattern, '');
          }
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      });

      // Fix 6: Ensure proper function syntax
      // Fix export default function declarations
      content = content.replace(/export\s+default\s+(\w+)\s*\(/g, 'export default function $1(');

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
    console.log('\n📊 Comment Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the comment fixer if called directly
if (require.main === module) {
  const fixer = new CommentFixer();
  fixer.run().catch(console.error);
}

module.exports = CommentFixer;
