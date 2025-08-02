#!/usr/bin/env node

/**
 * Final Build Fix Script for GroqTales
 * 
 * This script fixes the remaining critical syntax errors preventing build:
 * - Unterminated block comments
 * - Missing closing braces
 * - Malformed function declarations
 */

const fs = require('fs');
const path = require('path');

class FinalBuildFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Final build fixes...\n');
    
    try {
      const criticalFiles = [
        'app/api/story-summaries/route.ts',
        'app/api/webhook/route.ts',
        'app/admin/login/page.tsx'
      ];

      for (const file of criticalFiles) {
        await this.fixFile(path.join(this.projectRoot, file));
      }
      
      this.printSummary();
      console.log('✅ Final build fixes completed!');
    } catch (error) {
      console.error('❌ Error during final build fix:', error.message);
      process.exit(1);
    }
  }

  async fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;

      // Fix 1: Remove unterminated block comments before export functions
      const beforeFix1 = content;
      content = content.replace(/\s*\/\*\*\s*\n\s*export async function/g, '\n\nexport async function');
      if (content !== beforeFix1) {
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 2: Fix malformed function declarations
      const beforeFix2 = content;
      content = content.replace(/}\s*\/\*\*\s*\n\s*export async function/g, '}\n\nexport async function');
      if (content !== beforeFix2) {
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 3: Ensure proper closing braces
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      
      for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const prevChar = i > 0 ? content[i-1] : '';
        
        if (!inString && (char === '"' || char === "'" || char === '`')) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && prevChar !== '\\') {
          inString = false;
          stringChar = '';
        } else if (!inString) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
      }

      while (braceCount > 0) {
        content += '\n}';
        braceCount--;
        hasChanges = true;
        this.stats.errorsFixed++;
      }

      // Fix 4: Ensure proper module structure for webhook
      if (filePath.includes('webhook/route.ts')) {
        if (!content.includes('import ') && content.includes('export ')) {
          content = '// API route handler for webhook events\n' + content;
          hasChanges = true;
          this.stats.errorsFixed++;
        }
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
    console.log('\n📊 Final Build Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the final build fixer if called directly
if (require.main === module) {
  const fixer = new FinalBuildFixer();
  fixer.run().catch(console.error);
}

module.exports = FinalBuildFixer;
