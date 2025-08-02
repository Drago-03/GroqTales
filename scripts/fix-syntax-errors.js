#!/usr/bin/env node

/**
 * Targeted Syntax Error Fix Script for GroqTales
 * 
 * This script fixes specific syntax errors caused by the documentation script
 * that incorrectly removed function keywords and malformed export statements.
 */

const fs = require('fs');
const path = require('path');

class SyntaxErrorFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.stats = { filesFixed: 0, errorsFixed: 0 };
  }

  async run() {
    console.log('🔧 Fixing remaining syntax errors...\n');
    
    try {
      await this.fixSpecificSyntaxErrors();
      this.printSummary();
      console.log('✅ Syntax error fixes completed!');
    } catch (error) {
      console.error('❌ Error during syntax fix:', error.message);
      process.exit(1);
    }
  }

  async fixSpecificSyntaxErrors() {
    // Fix the specific files mentioned in the build error
    const filesToFix = [
      'app/admin/dashboard/page.tsx',
      'app/admin/login/page.tsx', 
      'app/community/creators/layout.tsx',
      'app/community/creators/page.tsx',
      'app/community/layout.tsx'
    ];

    for (const file of filesToFix) {
      await this.fixFile(path.join(this.projectRoot, file));
    }

    // Also scan for similar patterns across all files
    await this.scanAndFixAllFiles();
  }

  async fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix missing function keyword in export default statements
    // Pattern: export default FunctionName() {
    const exportPattern = /export\s+default\s+(\w+)\(\s*\)\s*\{/g;
    if (exportPattern.test(content)) {
      content = content.replace(exportPattern, 'export default function $1() {');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // Fix missing function keyword in export default with parameters
    // Pattern: export default FunctionName({ params }: { types }) {
    const exportWithParamsPattern = /export\s+default\s+(\w+)\(\s*\{([^}]+)\}\s*:\s*\{([^}]+)\}\s*\)\s*\{/g;
    if (exportWithParamsPattern.test(content)) {
      content = content.replace(exportWithParamsPattern, 'export default function $1({ $2 }: { $3 }) {');
      hasChanges = true;
      this.stats.errorsFixed++;
    }

    // Fix missing function keyword in regular function declarations
    // Pattern: function FunctionName() { becomes just FunctionName() {
    const functionPattern = /^(\s*)(\w+)\(\s*([^)]*)\s*\)\s*\{/gm;
    const lines = content.split('\n');
    let modifiedContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Check if this looks like a malformed function declaration
      const match = line.match(/^(\s*)(\w+)\(\s*([^)]*)\s*\)\s*\{/);
      if (match && !line.includes('export') && !line.includes('const') && !line.includes('let') && !line.includes('var')) {
        // Check if the previous lines suggest this should be a function
        const prevLines = lines.slice(Math.max(0, i-3), i).join(' ');
        if (!prevLines.includes('=') && !prevLines.includes('return') && !prevLines.includes('?') && !prevLines.includes(':')) {
          line = line.replace(/^(\s*)(\w+)\(/, '$1function $2(');
          hasChanges = true;
          this.stats.errorsFixed++;
        }
      }
      
      modifiedContent += line + '\n';
    }
    
    if (hasChanges) {
      content = modifiedContent.slice(0, -1); // Remove last newline
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`  🔧 Fixed ${path.relative(this.projectRoot, filePath)}`);
      this.stats.filesFixed++;
    }
  }

  async scanAndFixAllFiles() {
    const dirs = ['app', 'components', 'lib', 'hooks'];
    
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
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        await this.fixFile(itemPath);
      }
    }
  }

  printSummary() {
    console.log('\n📊 Syntax Fix Summary:');
    console.log(`  Files fixed: ${this.stats.filesFixed}`);
    console.log(`  Errors fixed: ${this.stats.errorsFixed}`);
  }
}

// Run the syntax error fixer if called directly
if (require.main === module) {
  const fixer = new SyntaxErrorFixer();
  fixer.run().catch(console.error);
}

module.exports = SyntaxErrorFixer;
